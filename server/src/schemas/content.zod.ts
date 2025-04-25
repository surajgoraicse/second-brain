import mongoose from "mongoose";
import { z } from "zod";

// const objectId = z
// 	.string()
// 	.refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid object id");

const objectId = z.instanceof(mongoose.Types.ObjectId);

export const contentSchema = z.object({
	link: z.string().url({ message: "invalid link" }).optional(),
	share: z
		.enum(["public", "private"], {
			message: "Share can be either public or private",
			required_error: "share can be either public or private",
		})
		.optional(),
	type: z.enum(["image", "video", "article", "audio"], {
		message: "type can only be image, video, article or audio",
		required_error: "content type is required",
	}),
	description: z.string(),
	title: z.string().min(3, "minimum length of title is 3"),
	tags: z.array(objectId, { message: "tags must be an array of objectId" }),
	userId: objectId,
});
