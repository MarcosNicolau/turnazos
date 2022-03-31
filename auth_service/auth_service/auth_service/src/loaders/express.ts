import express, { NextFunction, Request, Response } from "express";
import { Application } from "express";
import helmet from "helmet";
import { createErrorResponse } from "utils/http";

export const expressLoader = async (app: Application) => {
	app.set("trust proxy", true);
	app.use(helmet());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.get("/", (req, res) => res.send("hello world!"));

	//Custom error catcher middleware
	app.use((err: any, req: Request, res: Response, next: NextFunction) => {
		const statusCode = err?.status || err?.response?.status || 500;
		const isErrString = typeof err === "string";

		res.status(statusCode).send(
			createErrorResponse(
				statusCode,
				isErrString ? err : err?.message || err?.response?.message
			)
		);
	});
};
