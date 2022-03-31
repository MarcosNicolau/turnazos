import { ENV_VARS } from "./config/env";
import express from "express";
import { loaders } from "./loaders";

const startServer = async () => {
	const PORT = ENV_VARS.PORT || 5000;
	const app = express();
	await loaders(app);

	app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
};

startServer();
