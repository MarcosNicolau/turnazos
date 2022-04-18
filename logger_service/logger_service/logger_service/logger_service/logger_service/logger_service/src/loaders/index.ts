import { logger } from "config/logger";
import { amqpLoader } from "loaders/amqp";
import { processErrorsLoaders } from "loaders/error";

export const appLoaders = async () => {
	try {
		processErrorsLoaders();
		await amqpLoader();
		logger.info("amqp loaded");
	} catch (err) {
		return Promise.reject(err);
	}
};
