import express from "express";
const router = express.Router();
import {
	createDebate,
	getDebates,
	voteDebate,
	deleteDebate,
} from "../controllers/debates.js";
import { verifyToken } from "../middleware/authMiddleware.js";

/* CREATE */
router.post("/", verifyToken, createDebate);
// router.post("/:debateId", createArgument);

/* READ */
router.get("/", getDebates);

/* UPDATE */
router.patch("/:debateId/vote", verifyToken, voteDebate);

/* DELETE */
router.delete("/:debateId", verifyToken, deleteDebate);

export default router;
