import { Router } from "express";
import {
	changePassword,
	login,
	logout,
	registerUser,
} from "../controllers/user.controller.js";
import authUser from "../middlewares/userAuth.middleware.js";

const app = Router();

app.post("/register", registerUser);
app.post("/login", login);
app.post("/logout", authUser, logout);
app.post("/changePassword", authUser, changePassword);

export default app;
