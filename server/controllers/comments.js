import Argument from "../models/Argument.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const createComment = async (req, res) => {
	try {
		const { argumentId } = req.params;
		const { content } = req.body;
		const { userId } = req.user;
		const comment = new Comment({
			userId,
			argumentId,
			content,
			votes: {},
			replies: [],
		});
		await comment.save();
		res.status(201).json(comment);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
export const getComments = async (req, res) => {
	try {
		const { argumentId } = req.params;
		const argumentsData = await Argument.findById(argumentId)
			.select("comments")
			.populate({
				path: "comments",
				populate: {
					path: "userId",
					select: "firstName lastName picture createdAt _id",
				},
			});
		if (!argumentsData) {
			return res.status(404).json({ msg: "Not found" });
		}
		res.status(200).json(argumentsData.comments);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
export const deleteComment = async (req, res) => {
	try {
		const { commentId } = req.params;
		const { userId } = req.user;
		const comment = await Comment.findById(commentId);
		if (comment.userId.toString() !== userId)
			return res.status(401).json({ msg: "Unauthorized" });
		await Comment.findByIdAndDelete(commentId);
		res.status(204).json({});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

export const voteComment = async (req, res) => {
	try {
		const { commentId } = req.params;
		const { vote } = req.body;
		const { userId } = req.user;
		const comment = await Comment.findById(commentId);
		const isVoted = comment.votes.has(userId);
		if (isVoted && comment.votes.get(userId) === (vote === "true"))
			comment.votes.delete(userId);
		else {
			comment.votes.set(userId, vote);
		}
		await comment.save();
		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const addReply = async (req, res) => {
	try {
		const { commentId } = req.params;
		const { userId } = req.user;
		const { content } = req.body;
		const comment = await Comment.findById(commentId);
		const user = await User.findById(userId).select("firstName lastName");
		if (!user) return res.status(404);
		const { firstName, lastName } = user;
		comment.replies.push({ userId, content, firstName, lastName });
		comment.save();
		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
export const deleteReply = async (req, res) => {
	try {
		const { commentId, replyId } = req.params;
		const { userId } = req.user;
		await Comment.findByIdAndUpdate(commentId, {
			$pull: {
				replies: { userId, _id: replyId },
			},
		});
		res.status(204).json({});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
