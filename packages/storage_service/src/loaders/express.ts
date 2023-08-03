import { Application, NextFunction, Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import { router as v1Router } from "api/v1/routes";
import { AppError } from "utils/error";
import { StatusCodes } from "http-status-codes";
import { createErrorResponse } from "utils/http";

export const expressLoader = (app: Application) => {
	app.set("trust proxy", true);
	app.use(helmet());
	app.use(express.json({ limit: "20mb" }));
	app.use(express.urlencoded({ extended: true, limit: "20mb" }));

	app.use("/v1", v1Router);

	//Custom error catcher middleware
	app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
		const statusCode = err?.httpCode || StatusCodes.INTERNAL_SERVER_ERROR;
		const message = err?.message;
		console.error(`HTTP error, err: ${JSON.stringify(err)}`);
		res.status(statusCode).send(createErrorResponse(statusCode));
	});
};
