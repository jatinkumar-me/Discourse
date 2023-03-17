import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import sharp from "sharp";
import { rmSync } from "fs";
import { Readable } from "stream";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const conn = mongoose.createConnection(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

let gfs = null;
conn.once("open", () => {
	gfs = new mongoose.mongo.GridFSBucket(conn.db, {
		bucketName: "images",
	});
});

/* 
const storage = new GridFsStorage({
	url: MONGO_URI,
	options: {
		useUnifiedTopology: true,
	},
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			randomBytes(16, (err, buf) => {
				if (err) return reject(err);
				const fileName = buf.toString("hex") + path.extname(file.originalname);
				const fileInfo = {
					fileName,
					bucketName: "images",
				};
				resolve(fileInfo);
			});
		});
	},
});
*/

const storage = multer.diskStorage({
	destination: "uploads/",
	filename: (req, file, cb) => {
		randomBytes(16, (err, buf) => {
			if (err) return cb("crypto error");
			const fileName = buf.toString("hex") + path.extname(file.originalname);
			cb(null, fileName);
		});
	},
});

const store = multer({
	storage,
	limits: { fileSize: 20000000 },
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png|gif/;
		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = filetypes.test(file.mimetype);
		if (extname && mimetype) return cb(null, true);
		cb("filetype");
	},
});

export const uploadMiddleware = (req, res, next) => {
	const upload = store.single("image");
	upload(req, res, (err) => {
		if (err instanceof multer.MulterError)
			return res.status(400).send("File too large");
		if (err === "filetype") return res.status(400).send("Invalid file type");
		if (err) return res.sendStatus(500);
		const image = sharp(req.file.path);
		image
			.metadata()
			.then((metadata) => {
				if (metadata.width > 200) {
					return image.resize({ width: 200 }).toBuffer();
				} else {
					return image.toBuffer();
				}
			})
			.then((data) => {
				rmSync(req.file.path, { force: true });

				const uploadStream = gfs.openUploadStream(req.file.filename);

				// Pipe the compressed image buffer to the write stream
				const readable = new Readable();
				readable.push(data);
				readable.push(null);
				readable.pipe(uploadStream);

				// Wait for the upload to complete and return the file ID
				uploadStream.on("finish", () => {
					req.file.id = uploadStream.id;
					next();
				});
			})
			.catch((err) => {
				res.status(500).json({ msg: err.message });
			});
	});
};

export const deleteImage = (id ,res) => {
	if (!id || id === "undefined") return res.status(400).send("no image id");
	const _id = new mongoose.Types.ObjectId(id);
	gfs.delete(_id, (err) => {
		if (err) return res.status(500).send("image deletion error");
	});
};

export const getImage = (id, res) => {
	if (!id || id === "undefined") return res.status(400).send("no image id");
	const _id = new mongoose.Types.ObjectId(id);
	gfs.find({ _id }).toArray((err, files) => {
		if (!files || files.length === 0)
			return res.status(400).send("no files exist");
		gfs.openDownloadStream(_id).pipe(res);
	});
};
