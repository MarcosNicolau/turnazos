import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export type ReqUser = {
	id: number;
	name: string;
	phone: {
		id: number;
		number: string;
		area_code: string;
	};
};

type Req = Request;

export type ResponseSend = {
	result?: any;
	message: string;
	statusCode: StatusCodes;
	error: boolean;
};

type Res = Response<ResponseSend>;

export type IController = (req: Req, res: Res, next: NextFunction) => void;
