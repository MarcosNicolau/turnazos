import { ENV_VARS } from "config/env";
import { createErrorResponse, getLocationFromReq } from "./../../utils/http";
import { IController } from "types/express";
import jwt from "jsonwebtoken";
import fs from "fs";

export const authorize: IController = async (req, res, next) => {
	const authorization = req.headers.authorization;
	// Verify that the request ip is whitelisted
	const { ip } = getLocationFromReq(req);
	if (!ENV_VARS.ALLOWED_IPs.some((el) => el === ip))
		return res.status(401).send(createErrorResponse(res.statusCode));

	// Verify token
	if (!authorization) return res.status(401).send(createErrorResponse(res.statusCode));
	const [token, type] = authorization.split(" ");
	if (type !== "Bearer") res.status(401).send(createErrorResponse(res.statusCode));
	const cert = await fs.promises.readFile("./jwtRS256.key.pub"); // get public key

	jwt.verify(token, cert, (err, decoded) => {
		if (err) return res.status(401).send(createErrorResponse(res.statusCode));
		//@ts-expect-error decoded is an object, library does not allow to change
		if (decoded?.role === "admin") return next();
		return res.status(403).send(createErrorResponse(res.statusCode));
	});
};
