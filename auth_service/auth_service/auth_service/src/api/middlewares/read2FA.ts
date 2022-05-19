import { createErrorResponse } from "utils/http";
import { IController, ReqUser } from "types/express";
import Joi from "joi";
import { CUSTOM_HEADERS } from "constants/headers";

// This middleware decode the info passed from the auth service when there is a 2FA authentication
// And attaches the information to the req object
export const read2FA: IController = async (req, res, next) => {
	const user = req.headers[CUSTOM_HEADERS.USER];

	if (!user) return res.status(401).send(createErrorResponse(res.statusCode));

	try {
		if (Array.isArray(user)) return;
		//Data comes in base 64
		const parsedUser = JSON.parse(Buffer.from(user, "base64").toString("utf-8"));
		await Joi.object<ReqUser>({
			id: Joi.number().required(),
			name: Joi.string().required(),
			phone: Joi.object({
				number: Joi.string().required(),
				area_code: Joi.string().required(),
			}),
		}).validateAsync(parsedUser);
		req.user = parsedUser;
		return next();
	} catch (err) {
		return res.status(401).send(createErrorResponse(res.statusCode));
	}
};
