import mongoose, { Schema, model, Document } from "mongoose";
import { ITags } from "./tags.model.js";
import { IUser } from "./user.model.js";

export interface IContent extends Document {
	link: string;
	type: string;
    title: string;
    tags: ITags;
    userId:  IUser;
}

const contentSchema = new Schema<IContent>(
	{
		link: {
			type: String,
			trim: true,
		},
		type: {
			type: String,
			enum: ["dev", "dsa", "acad"],
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		tags: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tags",
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

const ContentModel = model<IContent>("Content", contentSchema);
export default ContentModel