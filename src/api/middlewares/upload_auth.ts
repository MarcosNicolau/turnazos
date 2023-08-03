import { createErrorResponse } from "./../../utils/http";
import { IController } from "types/express";
import { ENV_VARS } from "config/env";

export const upload_auth: IController = async (req, res, next) => {
	const authorization = req.headers.authorization;
	if (!authorization) return res.status(401).send(createErrorResponse(res.statusCode));
	const [type, token] = authorization.split(" ");
	if (type !== "X-API-Key") return res.status(401).send(createErrorResponse(res.statusCode));

	//Compare token
	if (token === ENV_VARS.UPLOAD_TOKEN) return next();
	res.status(401).send(createErrorResponse(res.statusCode));
};
