import { Request, Response } from "express";

export const getHelloWord = (req: Request, res: Response) => {
	return res.send("Hello world!");
};
