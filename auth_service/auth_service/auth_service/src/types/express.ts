import { Request, Response, NextFunction } from "express";

export type ReqUser = {
	userId: string;
	name: string;
	mail: string;
	clientId: string;
	token: string;
};

interface Req extends Request {
	user: ReqUser;
}

export type ResponseSend = {
	result?: any;
	message: string;
	statusCode: number;
	error: boolean;
};

interface Res extends Response<ResponseSend> {}

export type IController = (req: Req, res: Res, next: NextFunction) => void;
