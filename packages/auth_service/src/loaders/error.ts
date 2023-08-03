import { LoggerService } from "services/logger";

export const processErrorsLoaders = () => {
	// get the unhandled rejection and throw it to another fallback handler we already have.
	process.on("unhandledRejection", (error: any) => {
		LoggerService.sendLog(
			`UNHANDLED REJECTION: ${error?.description || error?.message || JSON.stringify(error)}`,
			{ level: "error", stack: error?.stack }
		);
	});
	process.on("uncaughtException", (error) => {
		LoggerService.sendLog(
			`UNCAUGHT EXCEPTION: ${error.name}, ${JSON.stringify(error.message)}`,
			{ level: "error", stack: error.stack }
		);
	});
};
