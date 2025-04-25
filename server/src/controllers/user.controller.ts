import { NextFunction, Request, Response } from "express";
import UserModel, { IUser } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { loginSchema, signUpSchema } from "../schemas/user.zod.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import ApiError from "../utils/ApiError.util.js";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest } from "../types/types.js";
import { cookieOptions } from "../constants.js";

export const registerUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		// take data
		// validate it
		// insert it in db
		// send response

		const { username, password, email, fullName } = req.body;

		const verify = signUpSchema.safeParse({
			username,
			password,
			email,
			fullName,
		});

		if (!verify.success) {
			return res
				.status(400)
				.json(
					new ApiResponse(
						400,
						false,
						"validation failed",
						verify.error.format()
					)
				);
		}
		const role = "user";
		const isVerifiedAdmin = false;
		const user = await UserModel.create({
			username,
			password,
			email,
			fullName,
			role,
			isVerifiedAdmin,
		});
		return res
			.status(201)
			.json(
				new ApiResponse(201, true, "User created successfully", user.userObj())
			);
	}
);

export const login = asyncHandler(
	// login user
	// take data from the body
	// validate it
	//

	async (req: Request, res: Response, next: NextFunction) => {
		const { username, email, password } = req.body;

		const validate = loginSchema.safeParse({ username, email, password });
		if (!validate.success) {
			return res
				.status(400)
				.json(
					new ApiError("Login validation failed", 400, validate.error.format())
				);
		}
		// let user;
		// if (!username) {
		// 	user = await UserModel.findOne({ email });
		// } else {
		// 	user = await UserModel.findOne({ username });
		// }

		const identifier = username ? { username } : { email };
		const user = await UserModel.findOne(identifier);

		if (!user) {
			return next(new ApiError("User not found, please signup", 404));
		}

		const comparePassword = await bcrypt.compare(password, user.password);
		if (!comparePassword) {
			return next(new ApiError("Incorrect Password", 401));
		}
		const accessToken = user.generateAccessToken();

		// update the refresh token
		const refreshToken = user.generateRefreshToken();
		user.refreshToken = refreshToken;

		await user.save({ validateBeforeSave: false });

		return res
			.status(200)
			.cookie("accessToken", accessToken, cookieOptions)
			.cookie("refreshToken", refreshToken, cookieOptions)
			.json(
				new ApiResponse(200, true, "User login successfully", user.userObj())
			);
	}
);

export const logout = asyncHandler(
	// check if user exists in auth
	// remove the cookies

	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		const user = req.user;
		if (!user) {
			return next(new ApiError("user already logout", 404));
		}
		user.refreshToken = "null";
		await user.save({ validateBeforeSave: false });

		return res
			.status(200)
			.cookie("refreshToken", "")
			.cookie("accessToken", "")
			.json(new ApiResponse(200, true, "Logout successfull"));
	}
);

export const changePassword = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		console.log("reach here");
		if (!req.user) {
			return next(new ApiError("User not found", 404));
		}
		const { oldPassword, newPassword } = req.body;
		if (oldPassword === newPassword) {
			return next(
				new ApiError("Old Password can't be same as new Password", 400)
			);
		}
		const changePassword = await req.user.changePassword(
			newPassword,
			oldPassword
		);
		if (!changePassword) {
			return next(new ApiError("Incorrect Previous password", 400));
		}
		return res
			.status(200)
			.json(new ApiResponse(200, true, "User password change"));
	}
);
