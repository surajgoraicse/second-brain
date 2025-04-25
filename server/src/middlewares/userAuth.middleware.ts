import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import UserModel from "../models/user.model.js";
import { AuthenticatedRequest } from "../types/types.js";

/**
 * take access token from the req cookies
 * validate it
 * check if user exists in db
 * attach the user obj in the req body
 */
const authUser = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		const accessToken = req.cookies.accessToken;
		console.log("reach herer");
		if (!accessToken) {
			return next(new ApiError("Access Token not found , Please login", 404));
		}
		const verifyJwt = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET!
		) as jwt.JwtPayload;
		const user = await UserModel.findOne({ username: verifyJwt.username });
		if (!user) {
			return next(new ApiError("User not found", 404));
		}
		console.log("user found");
		req.user = user;
		next();
	}
);

export default authUser;
