import { ENV_VARS } from "config/env";
import { logger } from "config/logger";
import express, { Application } from "express";
import { appLoaders } from "loaders";

export const startServer = async (app: Application) => {
	try {
		const PORT = ENV_VARS.PORT || 5001;
		await appLoaders(app);
		app.listen(PORT, () => logger.info("logger service started"));
	} catch {
		process.exitCode = 1;
	}
};

startServer(express());
