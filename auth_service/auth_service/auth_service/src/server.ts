import { ENV_VARS } from "./config/env";
import express from "express";
import { loaders } from "./loaders";
import { LoggerService } from "services/logger";

const startServer = async () => {
	const PORT = ENV_VARS.PORT || 5000;
	const app = express();
	try {
		await loaders(app);
		app.listen(PORT, () => LoggerService.sendLog(`server ready and listening on port ${PORT}`));
	} catch (err) {
		console.error(`WARNING, COULD NOT START SERVER, err: ${err}`);
	}
};

startServer();
