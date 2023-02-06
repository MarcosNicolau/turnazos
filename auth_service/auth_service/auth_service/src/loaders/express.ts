import express, { NextFunction, Request, Response } from "express";
import { Application } from "express";
import helmet from "helmet";
import { createErrorResponse } from "utils/http";
import { AppError } from "utils/error";
import { StatusCodes } from "http-status-codes";
import { router as v1Router } from "api/v1/routes";
import { LoggerService } from "services/logger";

export const expressLoader = async (app: Application) => {
	app.set("trust proxy", true);
	app.use(helmet());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use("/auth/v1", v1Router);

	//Custom error catcher middleware
	app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
		const statusCode = err?.httpCode || StatusCodes.INTERNAL_SERVER_ERROR;
		const message = err?.message;
		LoggerService.sendLog(message, {
			level: "http",
			httpCode: statusCode,
			description: err.description,
			stack: err.stack,
		});
		res.status(statusCode).send(createErrorResponse(statusCode, message));
	});
};
