import mongoose, { Schema, model, Document } from "mongoose";

export interface ITags extends Document {
	title: string;
}

const tagsSchema = new Schema<ITags>(
	{
		title: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
	},
	{ timestamps: true }
);

const TagsModel = model<ITags>("Tags", tagsSchema);
export default TagsModel;
