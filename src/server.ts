import { ENV_VARS } from "config/env";
import express, { Application } from "express";
import { appLoaders } from "loaders";
import { LoggerService } from "services";

export const startServer = async (app: Application) => {
	try {
		const PORT = ENV_VARS.PORT || 5003;
		await appLoaders(app);
		app.listen(PORT, () => LoggerService.sendLog(`server ready and listening on port ${PORT}`));
	} catch (err) {
		console.error(`WARNING, COULD NOT START SERVER, err: ${err}`);
	}
};

startServer(express());
