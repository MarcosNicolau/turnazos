import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export type ReqUser = {
	id: number;
	name: string;
	phone: {
		number: string;
		area_code: string;
	};
};

type Req = Request & {
	user: ReqUser;
};

export type ResponseSend = {
	result?: any;
	message: string;
	statusCode: StatusCodes;
	error: boolean;
};

type Res = Response<ResponseSend>;

export type IController = (req: Req, res: Res, next: NextFunction) => void;
