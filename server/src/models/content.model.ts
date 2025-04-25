import mongoose, { Schema, model, Document } from "mongoose";
import { ITags } from "./tags.model.js";
import { IUser } from "./user.model.js";

export interface IContent extends Document {
	link: string;
	type: string;
	title: string;
	tags: ITags[];
	userId: IUser;
	share: "public" | "private";
	description: string;
}

const contentTypes = ["image", "video", "article", "audio"];
const contentSchema = new Schema<IContent>(
	{
		link: {
			type: String,
			trim: true,
		},
		share: {
			type: String,
			enum: ["public", "private"],
			default: "private",
			required: true,
		},
		type: {
			type: String,
			enum: contentTypes,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		tags: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Tags",
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

const ContentModel = model<IContent>("Content", contentSchema);
export default ContentModel;
