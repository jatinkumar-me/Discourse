import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import debateRoutes from "./routes/debates.js";
import argumentRoutes from "./routes/arguments.js";
import commentRoutes from "./routes/comments.js";
import { getPicture } from "./controllers/pictures.js";
/* FILE STORAGE SETUP */

/* CONFIGURATION */
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("combined"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/debates", debateRoutes);
app.use("/debates/:debateId/arguments", argumentRoutes);
app.use("/arguments/:argumentId/comments", commentRoutes);
app.get("/pictures/:pictureId", getPicture);

/* MONGOOSE SET UP */
mongoose.set("strictQuery", false);
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(PORT, () => {
			console.log(`✅ Server running on ${PORT}`);
		});
	})
	.catch((err) => console.log(`❌Error ${err}. Did not connect`));
