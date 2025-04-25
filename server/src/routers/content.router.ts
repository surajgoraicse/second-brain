import { Router } from "express";
import {
	createContent,
	deleteContent,
	getAllContents,
	getContentsOfAUser,
} from "../controllers/content.controller.js";
import authUser from "../middlewares/userAuth.middleware.js";
import authAdmin from "../middlewares/adminAuth.middleware.js";

const app = Router();

// /api/v1/content
app.post("/", authUser, createContent);
app.delete("/", authUser, deleteContent);
app.get("/", authUser, getContentsOfAUser);
app.get("/all",authAdmin, getAllContents);

export default app;



// create one should only check if the title already is unique their contents