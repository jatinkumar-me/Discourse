import express from "express";
const router = express.Router({ mergeParams: true });
import {
	createArgument,
	getArguments,
	deleteArgument,
	voteArgument,
	updateArgument,
} from "../controllers/arguments.js";
import { verifyToken } from "../middleware/authMiddleware.js";


/* CREATE */
router.post("/", verifyToken, createArgument);


/* READ */
router.get("/", getArguments);

/* UPDATE */
router.patch("/:argumentId/vote", verifyToken, voteArgument);
router.patch("/:argumentId", verifyToken, updateArgument);

/* DELETE */
router.delete("/:argumentId", verifyToken, deleteArgument);


export default router;
