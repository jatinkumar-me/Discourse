import Debate from "../models/Debate.js";
import User from "../models/User.js";

/* 
// TODO:
1. add updateDebate route.
*/

export const createDebate = async (req, res) => {
	try {
		const { title, description, tags } = req.body;

		const { userId } = req.user;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ msg: "user doesn't exist" });
		const debate = new Debate({
			userId,
			title,
			description,
			tags,
		});
		await debate.save();
		res.status(201).json(debate);
	} catch (err) {
		res.status(409).json({ error: err.message });
	}
};

export const getDebates = async (req, res) => {
	try {
		const { sort_by, id, userId } = req.query;
		if(id) {
			const debate = await Debate.findById(id).populate('userId', 'firstName lastName');
			return res.status(200).json(debate);
		}
		const debates = userId
			? await Debate.find({ userId }).sort(`${sort_by}`).populate('userId', 'firstName lastName location occupation picture')
			: await Debate.find().collation({locale: "en"}).sort(`${sort_by}`).populate('userId', 'firstName lastName location occupation picture');
		res.status(200).json(debates);
	} catch (err) {
		res.status(404).json({ error: err.message });
	}
};

export const voteDebate = async (req, res) => {
	try {
		const { debateId } = req.params;
		const { vote } = req.body;
		const { userId } = req.user;
		const debate = await Debate.findById(debateId);
		const isVoted = debate.votes.has(userId);
		if (isVoted && debate.votes.get(userId) === vote)
			debate.votes.delete(userId);
		else {
			debate.votes.set(userId, vote);
		}
		await debate.save();
		res.status(200).json(debate.votes);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deleteDebate = async (req, res) => {
	try {
		const { debateId } = req.params;
		const { userId } = req.user;
		const debate = await Debate.findById(debateId);
		if (debate.userId.toString() !== userId)
			return res.status(401).json({ msg: "Unauthorized" });
		await Debate.findByIdAndDelete(debateId);
		res.status(204).json({});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
