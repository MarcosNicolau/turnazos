import { Request } from "express";
import { ResponseSend } from "types/express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

type SuccessResponseArgs = {
	[key in keyof Omit<ResponseSend, "result">]?: ResponseSend[key];
};

export const createSuccessResponse = (result?: any, args?: SuccessResponseArgs): ResponseSend => ({
	result: result || {},
	message: args?.message || "ok",
	statusCode: args?.statusCode || 200,
	error: false,
});

export const createErrorResponse = (statusCode: StatusCodes, message?: string): ResponseSend => ({
	message: message || getReasonPhrase(statusCode) || "",
	statusCode,
	error: true,
});

export const getLocationFromReq = (req: Request) => {
	const ip = req.ip;
	const userAgent = req.headers["user-agent"]?.toString() || "";
	const time = new Date(Date.now()).toLocaleString();
	return { ip, userAgent, time };
};
