import { UnknownError } from "./../../utils/error";
import { createErrorResponse } from "utils/http";
import { IController, ReqUser } from "types/express";
import jwt from "jsonwebtoken";
import Joi from "joi";

// This middleware decode the JWT passed from the auth service
// And attaches the information to the req object
export const readJWT: IController = async (req, res, next) => {
	const authorization = req.headers.authorization;
	if (!authorization) return res.status(401).send(createErrorResponse(res.statusCode));

	try {
		const payload = <ReqUser>jwt.decode(authorization, {
			json: true,
		});
		await Joi.object<ReqUser>({
			id: Joi.number().required(),
			name: Joi.string().required(),
			phone: Joi.object({
				number: Joi.string().required(),
				area_code: Joi.string().required(),
			}),
		}).validateAsync(payload);
		req.user = payload;
		return next();
	} catch (err) {
		return next(new UnknownError(err));
	}
};
