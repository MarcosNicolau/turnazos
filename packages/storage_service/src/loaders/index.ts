import { Application } from "express";
import { expressLoader } from "loaders/express";

export const appLoaders = async (app: Application) => {
	expressLoader(app);
};
