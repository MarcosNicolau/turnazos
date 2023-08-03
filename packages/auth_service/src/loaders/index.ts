import { amqpLoader } from "./amqp";
import { Application } from "express";
import { dbLoader } from "loaders/db";
import { eventsLoaders } from "loaders/events";
import { expressLoader } from "./express";

export const loaders = async (app: Application) => {
	try {
		const amqpChannel = await amqpLoader();
		await eventsLoaders(amqpChannel);
		await dbLoader();
		await expressLoader(app);
	} catch (err) {
		return Promise.reject(err);
	}
};
