import express, { Application } from "express";
import { getHelloWord } from "controllers";

export const startServer = (app: Application) => {
	const PORT = 5000;
	app.get("/", getHelloWord);
	app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
};

startServer(express());
