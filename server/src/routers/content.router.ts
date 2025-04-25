import { Router } from "express";
import { createContent, deleteContent,  getContents } from "../controllers/content.controller.js";
import authUser from "../middlewares/userAuth.middleware.js";

const app = Router()

// /api/v1/content
app.post('/' , authUser, createContent)
app.delete('/' ,authUser , deleteContent)
app.get('/' ,authUser , getContents)


export default app