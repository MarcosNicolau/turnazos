import { TokenPayload } from "type/token";
import { UnknownError, InvalidCredentialsError } from "utils/error";
import { createErrorResponse } from "utils/http";
import { IController } from "types/express";
import Joi from "joi";
import { TokenService } from "services/token";

// This middleware verifies the JWT
// And attaches the information to the req object
export const authenticate: IController = async (req, res, next) => {
	const authorization = req.headers.authorization;
	if (!authorization) return res.status(401).send(createErrorResponse(res.statusCode));
	//Authorization follows the <type> <token> schema
	const [authType, token] = authorization.split(" ");

	const error = () => next(new InvalidCredentialsError());

	try {
		//We only support bearer authentication
		if (authType !== "Bearer") return error();
		// verify jwt id
		const { isValid, payload: decoded } = await TokenService.verify(token);
		if (!isValid) return error();
		try {
			//We expect the jwt payload to contain this information
			const payload: TokenPayload = await Joi.object<TokenPayload>({
				user_id: Joi.number().required(),
				name: Joi.string().required(),
			})
				.unknown(true)
				.validateAsync(decoded);
			req.user = { id: Number(payload.user_id), name: payload.name };
			return next();
		} catch (err) {
			return error();
		}
	} catch (err) {
		return next(new UnknownError(err));
	}
};
