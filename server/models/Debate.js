import mongoose from "mongoose";
import Argument from "./Argument.js";

const debateSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
			max: 100,
		},
		description: {
			type: String,
		},
		tags: [String],
		votes: {
			type: Map,
			of: Boolean,
			default: {},
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

debateSchema.virtual("arguments", {
	ref: "Argument",
	localField: "_id",
	foreignField: "debateId",
});

debateSchema.set("toObject", { virtuals: true });
debateSchema.set("toJSON", { virtuals: true });

debateSchema.pre("save", function (next) {
	let upvotes = 0;
	this.votes.forEach((vote) => {
		if (vote) upvotes++;
		else upvotes--;
	});
	this.upvotes = upvotes;
	next();
});

debateSchema.pre(
	"findOneAndDelete",
	{ document: true, query: true },
	async function (next) {
		await Argument.deleteMany({ debateId: this._conditions._id });
		next();
	}
);

const Debate = mongoose.model("Debate", debateSchema);
export default Debate;
