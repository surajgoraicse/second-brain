import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model.js";

export type ControllerType = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<any>;


export interface AuthenticatedRequest extends Request{
	user?: IUser
} 

