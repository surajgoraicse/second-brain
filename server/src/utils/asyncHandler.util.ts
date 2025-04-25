import { Request, Response, NextFunction, RequestHandler } from "express";


export const asyncHandler = (
	fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch((err) => {
			next(err);
		});
	};
};
