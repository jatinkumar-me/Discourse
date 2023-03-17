import mongoose from "mongoose";
import Comment from "./Comment.js";

const argumentSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		debateId: {
			type: mongoose.Types.ObjectId,
			ref: "Debate",
			required: true,
		},
		tag: {
			type: String,
			required: true,
			lowercase: true,
			enum: ["for", "against", "neutral"],
		},
		content: {
			type: Object,
			required: true,
		},
		votes: {
			type: Map,
			of: Boolean,
		},
		upvotes: {
			type: Number,
			default: function () {
				let upvotes = 0;
				this.votes.forEach((vote) => {
					if (vote) upvotes++;
					else upvotes--;
				});
				return upvotes;
			},
		},
	},
	{ timestamps: true }
);

argumentSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "argumentId",
});
argumentSchema.set("toObject", { virtuals: true });
argumentSchema.set("toJSON", { virtuals: true });

argumentSchema.pre("save", function (next) {
	let upvotes = 0;
	this.votes.forEach((vote) => {
		if (vote) upvotes++;
		else upvotes--;
	});
	this.upvotes = upvotes;
	next();
});

argumentSchema.pre(
	"findOneAndDelete",
	{ document: true, query: true },
	async function (next) {
		await Comment.deleteMany({ argumentId: this._conditions._id });
		next();
	}
);
argumentSchema.pre(
	"deleteMany",
	{ document: true, query: true },
	async function (next) {
		await Comment.deleteMany({ argumentId: this._conditions._id });
		next();
	}
);

const Argument = mongoose.model("Argument", argumentSchema);
export default Argument;
