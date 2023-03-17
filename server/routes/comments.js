import express from "express";
const router = express.Router({ mergeParams: true });
import {
	createComment,
	deleteComment,
	getComments,
	voteComment,
	addReply,
	deleteReply,
} from "../controllers/comments.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.post("/", verifyToken, createComment);

router.get("/", getComments);

router.patch("/:commentId/vote", verifyToken, voteComment);
router.patch("/:commentId/reply", verifyToken, addReply);

router.delete("/:commentId", verifyToken, deleteComment);
router.delete("/:commentId/:replyId", verifyToken, deleteReply);

export default router;
