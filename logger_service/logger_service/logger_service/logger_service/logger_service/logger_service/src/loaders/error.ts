import { logger } from "config/logger";

export const processErrorsLoaders = () => {
	// get the unhandled rejection and throw it to another fallback handler we already have.
	process.on("unhandledRejection", (error) => {
		throw error;
	});
	process.on("uncaughtException", (error) => {
		logger.error(`uncaught exception ${JSON.stringify(error)}`);
	});
};
