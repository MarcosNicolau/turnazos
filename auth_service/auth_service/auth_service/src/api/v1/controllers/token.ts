import { createSuccessResponse } from "utils/http";
import { TokenService } from "../../../services/token";
import Joi from "joi";
import { IController } from "types/express";

interface RefreshTokenPayload {
	refresh_token: string;
}

export const refreshToken: IController = async (req, res, next) => {
	const body = req.body;

	try {
		const payload: RefreshTokenPayload = await Joi.object<RefreshTokenPayload>({
			refresh_token: Joi.string().required(),
		}).validateAsync(body);
		const { accessToken, refreshToken } = await TokenService.refreshToken(
			payload.refresh_token
		);
		return res.send(createSuccessResponse({ accessToken, refreshToken }));
	} catch (err) {
		return next(err);
	}
};
