import { logger } from "config/logger";
import { amqpLoader } from "loaders/amqp";
import { expressLoader } from "loaders/express";
import { processErrorsLoaders } from "loaders/error";
import { Application } from "express";

export const appLoaders = async (app: Application) => {
	try {
		processErrorsLoaders();
		await amqpLoader();
		expressLoader(app);
		logger.info("amqp loaded");
	} catch (err) {
		return Promise.reject(err);
	}
};
