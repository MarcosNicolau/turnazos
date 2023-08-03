import { processErrorsLoaders } from "./error";
import { eventsLoader } from "./events";
import { amqpLoader } from "./amqp";
import { Application } from "express";
import { expressLoader } from "loaders/express";

export const appLoaders = async (app: Application) => {
	processErrorsLoaders();
	const channel = await amqpLoader();
	await eventsLoader(channel);
	expressLoader(app);
	return;
};
