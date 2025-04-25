import mongoose, { Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export interface IUser extends Document {
	username: string;
	password: string;
	email: string;
	fullName: string;
	role: "user" | "admin";
	isVerifiedAdmin : boolean,
	refreshToken: string;
	avatar: string;
	changePassword: (
		newPassword: string,
		oldPassword: string
	) => Promise<boolean>;
	generateAccessToken: () => string;
	generateRefreshToken: () => string;
	userObj: () => Omit<IUser, "password" | "refreshToken" | "accessToken">;
}

const userSchema = new mongoose.Schema<IUser>(
	{
		username: {
			type: String,
			unique: [true, "Username should be unique"],
			required: [true, "Please provide username"],
			trim: true,
			lowercase: true,
		},

		password: {
			type: String,
			required: [true, "Please provide password"],
			trim: true,
		},

		avatar: {
			type: String,
			default: "some default image link",
		},

		email: {
			type: String,
			required: [true, "Please provide email"],
			match: [/^[\w.-]+@[\w.-]+\.[a-z]{2,4}$/, "Invalid email"],
			trim: true,
			lowercase: true,
			unique: [true, "Email should be unique"],
		},

		fullName: {
			type: String,
			required: [true, "Please provide fullName"],
			trim: true,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		isVerifiedAdmin: {
			type: Boolean,
			default : false,
		},
		refreshToken: {
			type: String,
			default: "null",
			required: true,
		},
	},
	{ timestamps: true }
);

// hashes the password before saving in db
userSchema.pre("save", async function (this: IUser, next) {
	try {
		if (this.isModified("password")) {
			this.password = await bcrypt.hash(this.password, 10);
		}
		next();
	} catch (error) {
		next(error as Error);
	}
});

userSchema.methods.changePassword = async function (
	newPassword: string,
	oldPassword: string
): Promise<boolean> {
	// compare the password first
	// then update the password
	const compare = await bcrypt.compare(oldPassword, this.password);
	if (!compare) {
		return false;
	}
	this.password = newPassword;
	await this.save();
	return true;
};

// instance methods to genereate tokens
userSchema.methods.generateAccessToken = function () {
	const payload = {
		_id: this._id,
		username: this.username,
		avatar: this.avatar,
		email: this.email,
		role: this.role,
	};
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
	// const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
	// use this
	if (!accessTokenSecret) {
		throw new Error("Missing ACCESS_TOKEN_SECRET or ACCESS_TOKEN_EXPIRY");
	}
	return jwt.sign(payload, accessTokenSecret, { expiresIn: "4d" });
};

userSchema.methods.generateRefreshToken = function () {
	const payload = {
		_id: this._id,
		username: this.username,
	};
	const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
	// const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
	// use this
	if (!refreshTokenSecret) {
		throw new Error("Missing REFRESH_TOKEN_SECRET or ACCESS_TOKEN_EXPIRY");
	}
	return jwt.sign(payload, refreshTokenSecret, { expiresIn: "10d" });
};

userSchema.methods.userObj = function (): Omit<
	IUser,
	"password" | "refreshToken" | "accessToken"
> {
	const user = this.toObject();
	delete user.password;
	delete user.refreshToken;
	delete user.accessToken;
	return user;
};

userSchema.virtual("firstName").get(function (this: IUser): string {
	return this.fullName.split(" ")[0];
});

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
