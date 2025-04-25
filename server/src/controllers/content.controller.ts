import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { AuthenticatedRequest } from "../types/types.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import ApiError from "../utils/ApiError.util.js";
import { contentSchema } from "../schemas/content.zod.js";
import ContentModel from "../models/content.model.js";

export const createContent = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		const user = req.user;
		if (!user) {
			return next(new ApiError("Please login", 401));
		}

		// creating a payload
		const userId = user._id;
		const { link, type, title, tags } = req.body;

		// handling the tags
		

		const validate = contentSchema.safeParse({
			link,
			type,
			title,
			tags,
			userId,
		});
		if (!validate.success) {
			console.log(validate.error.format());
			return next(new ApiError("Content body validation failed", 400));
        }
        const createContent = await ContentModel.create({ link, type, title, tags, userId })
        console.log(createContent);

        return res.status(201).json(new ApiResponse(201, true, "content created", createContent))

	}
);

export const deleteContent = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {}
);

export const getContents = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {}
);
