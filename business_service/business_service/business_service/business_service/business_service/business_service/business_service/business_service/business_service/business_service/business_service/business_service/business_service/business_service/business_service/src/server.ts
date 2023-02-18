import express, { Application } from "express";

export const startServer = (app: Application) => {
	const PORT = 5000;
	app.get("/", (req, res) => res.send("Hello world!"));
	app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
};

startServer(express());
