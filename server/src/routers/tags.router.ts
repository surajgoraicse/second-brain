import { Router } from "express";
import {  createTags, deleteTags, getAllTags } from "../controllers/tags.controller.js";
import authUser from "../middlewares/userAuth.middleware.js";

const app = Router()

// api/v1/tag
app.post('/', authUser, createTags)
app.get('/', authUser, getAllTags)
app.delete('/', authUser, deleteTags)

export default app 