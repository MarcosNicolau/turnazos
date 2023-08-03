import { ENV_VARS } from "config/env";
import express, { Application } from "express";
import { loaders } from "loaders/index";
import { LoggerService } from "services/logger";

export const startServer = async (app: Application, port: number) => {
	try {
		await loaders(app);
		app.listen(port, () => LoggerService.sendLog(`server ready and listening on port ${port}`));
	} catch (err) {
		console.error(`WARNING, COULD NOT START SERVER, err: ${JSON.stringify(err)}`);
		process.exitCode = 1;
	}
};

startServer(express(), Number(ENV_VARS.PORT) || 5003);
