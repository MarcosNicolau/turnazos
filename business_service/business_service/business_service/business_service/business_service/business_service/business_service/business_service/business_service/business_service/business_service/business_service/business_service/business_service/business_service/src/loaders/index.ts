import { amqpLoader } from "./amqp";
import { dbLoader } from "./db";
import { Application } from "express";
import { processErrorsLoaders } from "loaders/error";
import { eventsLoader } from "loaders/events";

export const loaders = async (app: Application) => {
	try {
		const channel = await amqpLoader();
		await eventsLoader(channel);
		await dbLoader();
		processErrorsLoaders();
	} catch (err) {
		return Promise.reject(err);
	}
};
