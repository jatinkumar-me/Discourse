import { deleteImage, getImage } from "../middleware/uploadMiddleware.js";
import User from "../models/User.js";

export const updateProfilePicture = async (req, res) => {
	try {
		const { file } = req;
		const { id } = file;
		const { userId } = req.user;
		const user = await User.findById(userId);
		const previousPictureId = user.picture;
		if (previousPictureId) deleteImage(previousPictureId, res);
		user.picture = id;
		await user.save();
		res.status(200).json({ picture: id });
	} catch (err) {
		res.status(500).json({ msg: "Image upload error" });
	}
};

export const getUser = async (req, res) => {
	try {
		const {userId} = req.params;
		const user = await User.findById(userId, {password:0});
		if(!user) return res.status(404).json({msg: "user doesn't exist"});
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

export const getProfilePicture = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ msg: "user doesn't exist" });
		const pictureId = user.picture;
		if (!pictureId)
			return res
				.status(404)
				.json({ msg: "user doesn't have a profile picture" });
		getImage(pictureId, res);
	} catch (err) {
		res.status(500).json({ msg: "Image download error" });
	}
};
