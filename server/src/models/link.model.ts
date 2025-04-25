import mongoose, { Schema, model, Document } from "mongoose";
import { IUser } from "./user.model.js";

export interface ILinkSchema extends Document {
	hash: string;
	userId: IUser;
}

const linkSchema = new Schema<ILinkSchema>(
	{
		hash: {
			type: String,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

const LinkModel = model<ILinkSchema>("Content", linkSchema);
export default LinkModel;
