import Argument from "../models/Argument.js";
import Debate from "../models/Debate.js";

export const createArgument = async (req, res) => {
	try {
		const { debateId } = req.params;
		const { tag, content } = req.body;
		const { userId } = req.user;
		const argument = new Argument({
			userId,
			debateId,
			tag,
			content,
			votes: {},
		});
		await argument.save();
		res.status(201).json(argument);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
export const getArguments = async (req, res) => {
	try {
		const { debateId } = req.params;
		const { sort_by } = req.query;

		const argumentsData = await Debate.findById(debateId)
			.select("arguments")
			.sort(`${sort_by}`)
			.populate({
				path: "arguments",
				populate: { path: "userId", select: "-password -email -location" },
			});
		res.status(200).json(argumentsData.arguments);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
export const getUserArguments = async (req, res) => {
	try {
		const { userId } = req.params;
		const userArgumentsData = await Argument.find({ userId });
		return res.status(200).json(userArgumentsData);
	} catch (err) {
		res.status(404).json({ error: err.message });
	}
};

export const deleteArgument = async (req, res) => {
	try {
		const { argumentId } = req.params;
		const { userId } = req.user;
		const argument = await Argument.findById(argumentId);
		if (argument.userId.toString() !== userId)
			return res.status(401).json({ msg: "Unauthorized" });
		await Argument.findByIdAndDelete(argumentId);
		res.status(204).json({});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

export const voteArgument = async (req, res) => {
	try {
		const { argumentId } = req.params;
		const { vote } = req.body;
		const { userId } = req.user;
		const argument = await Argument.findById(argumentId);
		const isVoted = argument.votes.has(userId);
		if (isVoted && argument.votes.get(userId) === (vote === "true"))
			argument.votes.delete(userId);
		else {
			argument.votes.set(userId, vote);
		}
		console.log(argument.votes);
		await argument.save();
		res.status(200).json(argument);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const updateArgument = async (req, res) => {
	try {
		const { argumentId } = req.params;
		const { content } = req.body;
		const { userId } = req.user;
		const argument = await Argument.findById(argumentId);
		if(!argument)
			return res.status(404).json({msg: "Not found"});
		if (argument.userId.toString() !== userId)
			return res.status(401).json({ msg: "Unauthorized" });
		argument.content = content;
		await argument.save();
		res.status(200).json(argument.content);
	} catch (err) {
		res.status(500).json({error: err.message});
	}
};
