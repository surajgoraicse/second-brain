import mongoose, { Schema, model, Document } from "mongoose";

export interface ITags extends Document {
	title: string;
}

const tagsSchema = new Schema<ITags>(
	{
		title: {
			type: String,
		},
	},
	{ timestamps: true }
);

const TagsModel = model<ITags>("Content", tagsSchema);
export default TagsModel;
