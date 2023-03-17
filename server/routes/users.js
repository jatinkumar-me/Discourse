import express from "express";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";
import { updateProfilePicture, getProfilePicture, getUser } from "../controllers/users.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getUserArguments } from "../controllers/arguments.js";

const router = express.Router();

/* CREATE */
// covered in auth.

/* READ */
router.get("/:userId", getUser);
router.get("/:userId/arguments", getUserArguments);
router.get("/:userId/profile-pic", getProfilePicture);


/* UPDATE */
router.put(
	"/change-profile-pic",
	verifyToken,
	uploadMiddleware,
	updateProfilePicture
);

/* DELETE */
export default router;
