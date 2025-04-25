import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import TagsModel from "../models/tags.model.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import { tagValidation } from "../schemas/tag.zod.js";
import ApiError from "../utils/ApiError.util.js";

export const createTags = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		// how to handle tags :
		// take an array of tags from the user
		// validate them
		// check all the tags which does not exists in db and then insert them into db.

		let tags: string[] = req.body.tags; // ["dev" , "Dsa"]
		const validate = tagValidation.safeParse(tags);
		if (!validate.success) {
			return next(new ApiError("invalid tags", 400, validate.error.format()));
		}
		let dbTags = await TagsModel.find();

		// filter the tags which are present.
		const filterTags = tags.filter((tag) => {
			let isAvailable = true;
			for (let i = 0; i < dbTags.length; i++) {
				if (dbTags[i].title.toLowerCase() === tag.toLowerCase()) {
					isAvailable = false;
					break;
				}
			}
			return isAvailable;
		});

		// prepare the new tags to insert in db
		const tagObj = filterTags.map((tag) => {
			return {
				title: tag,
			};
		});

		// insert in db
		let newDbTags;
		if (tagObj.length != 0) {
			newDbTags = await TagsModel.insertMany(tagObj);
			console.log(newDbTags);
		}
		return res
			.status(200)
			.json(new ApiResponse(201, true, "tags created successfully" , newDbTags));
	}
);
export const deleteTags = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let tags: string[] = req.body.tags; // ["dev" , "Dsa"]
		const validate = tagValidation.safeParse(tags);
		if (!validate.success) {
			return next(new ApiError("invalid tags", 400, validate.error.format()));
		}

		
		

	}
);
export const getAllTags = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const tags = await TagsModel.find();
		console.log(tags);
		return res
			.status(200)
			.json(new ApiResponse(200, true, "fetched all tags", tags));
	}
);
