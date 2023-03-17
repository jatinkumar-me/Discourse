import mongoose from "mongoose";

const replySchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		firstName: String,
		lastName: String,
		content: {
			type: String,
			max: 400,
		},
	},
	{ timestamps: true }
);

const commentSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		argumentId: {
			type: mongoose.Types.ObjectId,
			ref: "Argument",
			required: true,
		},
		content: {
			type: String,
			max: 2000,
		},
		votes: {
			type: Map,
			of: Boolean,
		},
		replies: [replySchema],
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
