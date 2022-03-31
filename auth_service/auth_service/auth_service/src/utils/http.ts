import { HTTP_DEFAULT_MESSAGES } from "constants/http";
import { Request } from "express";
import { ResponseSend } from "types/express";

type SuccessResponseArgs = {
	[key in keyof Omit<ResponseSend, "result">]?: ResponseSend[key];
};

export const createSuccessResponse = (result?: any, args?: SuccessResponseArgs): ResponseSend => ({
	result: result || {},
	message: args?.message || "ok",
	statusCode: args?.statusCode || 200,
	error: false,
});

export const createErrorResponse = (statusCode: number, message?: string): ResponseSend => ({
	message: message || HTTP_DEFAULT_MESSAGES[statusCode] || "",
	statusCode,
	error: true,
});

export const getLocationFromReq = (req: Request) => {
	const ip = req.ip;
	const userAgent = req.headers["user-agent"]?.toString() || "";
	const time = new Date(Date.now()).toLocaleString();
	return { ip, userAgent, time };
};
