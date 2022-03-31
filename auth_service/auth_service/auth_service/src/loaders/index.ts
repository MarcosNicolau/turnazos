import { Application } from "express";
import { dbLoader } from "loaders/db";
import { expressLoader } from "./express";

export const loaders = async (app: Application) => {
	await dbLoader();
	await expressLoader(app);
	return;
};
