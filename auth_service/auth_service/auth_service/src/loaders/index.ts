import { Application } from "express";
import { dbLoader } from "loaders/db";
import { eventsLoaders } from "loaders/events";
import { expressLoader } from "./express";

export const loaders = async (app: Application) => {
	await dbLoader();
	eventsLoaders();
	await expressLoader(app);
	return;
};
