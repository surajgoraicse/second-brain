import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { AuthenticatedRequest } from "../types/types.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import ApiError from "../utils/ApiError.util.js";
import { contentSchema } from "../schemas/content.zod.js";
import ContentModel from "../models/content.model.js";
import { createTagsFn } from "./tags.controller.js";
import mongoose from "mongoose";

export const createContent = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		const user = req.user;
		if (!user) {
			return next(new ApiError("Please login", 401));
		}

		// creating a payload
		const userId = user._id;
		const { link, type, title, tags } = req.body;
		const checkIfTitleExists = await ContentModel.findOne({
			title,
			userId: user._id,
		});
		if (checkIfTitleExists) {
			return next(new ApiError("Title already exists", 400));
		}

		// handling the tags
		const allTags = await createTagsFn(tags);
		if (!allTags) {
			return next(new ApiError("Handling tags error", 400));
		}
		// allTags from db = [{_id : xyz , title : "z"}]
		// tags = ["dev"  , "dsa"]

		// creating an array of objectId of our tags
		const tagsObjId = [];
		for (let i = 0; i < tags.length; i++) {
			for (let j = 0; j < allTags.length; j++) {
				if (tags[i].toLowerCase() === allTags[j].title.toLowerCase()) {
					tagsObjId.push(allTags[j]._id);
				}
			}
		}
		const payload = {
			link,
			type,
			title,
			tags: tagsObjId,
			userId,
		};
		const validate = contentSchema.safeParse(payload);
		if (!validate.success) {
			return next(
				new ApiError(
					"Content body validation failed",
					400,
					validate.error.format()
				)
			);
		}
		const createContent = await ContentModel.create({
			link,
			type,
			title,
			tags: tagsObjId,
			userId,
		});

		return res
			.status(201)
			.json(new ApiResponse(201, true, "content created", createContent));
	}
);

export const deleteContent = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		/**
		 * deletes a content based on objectId
		 * make sure it only deletes only those contents which belongs to the user
		 */
		const id = req.body?.id;
		const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
		if (!isValidObjectId) {
			return next(new ApiError("Invalid Object id", 400));
		}

		const userId = req.user?._id;

		const deleteContent = await ContentModel.findOneAndDelete({
			_id: id,
			userId: userId,
		});
		if (!deleteContent) {
			return next(new ApiError("deletion failed, content not found", 400));
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					true,
					"Content deleted successfully",
					deleteContent
				)
			);
	}
);

export const getContentsOfAUser = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		const userId = req.user?._id;

		const allContents = await ContentModel.find({ userId });

		return res
			.status(200)
			.json(
				new ApiResponse(200, true, "contents fetched successfully", allContents)
			);
	}
);

export const getAllContents = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const allContents = await ContentModel.find();

		return res
			.status(200)
			.json(
				new ApiResponse(200, true, "contents fetched successfully", allContents)
			);
	}
);
