import express, { NextFunction, Request, Response } from "express";
import { Application } from "express";
import helmet from "helmet";
import { createErrorResponse } from "utils/http";
import { AppError } from "utils/error";
import { StatusCodes } from "http-status-codes";
import v1Routes from "api/v1/routes";

export const expressLoader = async (app: Application) => {
	app.set("trust proxy", true);
	app.use(helmet());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use("/user/v1", v1Routes);

	//Custom error catcher middleware
	app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
		const statusCode = err?.httpCode || StatusCodes.INTERNAL_SERVER_ERROR;
		const message = err?.message;
		res.status(statusCode).send(createErrorResponse(statusCode, message));
	});
};
