import { ENV_VARS } from "config/env";
import express, { Application } from "express";
import { appLoaders } from "loaders/index";

export const startServer = (app: Application, port: number) => {
	try {
		appLoaders(app);
		app.listen(port, () => console.log(`app listening on port ${port}`));
	} catch (err) {
		console.error(`Error while starting server, err: ${JSON.stringify(err)}`);
		process.exitCode = 1;
	}
};

startServer(express(), Number(ENV_VARS.PORT) || 5005);
