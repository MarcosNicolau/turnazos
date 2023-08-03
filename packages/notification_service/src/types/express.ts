import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export type ResponseSend = {
	result?: any;
	message: string;
	statusCode: StatusCodes;
	error: boolean;
};

type Res = Response<ResponseSend>;

export type IController = (req: Request, res: Res, next: NextFunction) => void;
