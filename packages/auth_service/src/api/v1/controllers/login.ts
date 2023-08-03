import { formatPhone } from "./../../../utils/phone";
import { TokenService } from "services/token";
import Joi from "joi";
import { IController } from "types/express";
import { EventEmitterService, UserService } from "services";
import { PhoneIdentifiers, GetWithCredentialsPayload, SanitizedUser } from "type/user";
import { createSuccessResponse } from "utils/http";
import { OTPCodeService } from "services/OTPCode";
import { REDIS_KEYS } from "constants/redis";
import { InvalidCredentialsError } from "utils/error";

export const login: IController = async (req, res, next) => {
	//Validate payload
	try {
		const payload = await Joi.object<GetWithCredentialsPayload>({
			phone: Joi.object<PhoneIdentifiers>({
				country_code: Joi.number().required(),
				number: Joi.number().required(),
			}).required(),
			password: Joi.string().required(),
		}).validateAsync(req.body);
		try {
			const user = await UserService.getWithCredentials(payload);
			//User credentials are valid, generate OTP code to confirm the login
			EventEmitterService.user.generateLoginOTPCode(user);
			return res.send(createSuccessResponse({}, { message: "otp code generated" }));
		} catch (err) {
			return next(err);
		}
	} catch (err) {
		return next(err);
	}
};

interface LoginConfirm {
	phone: PhoneIdentifiers;
	otp_code: number;
}

export const loginConfirm: IController = async (req, res, next) => {
	try {
		//Validate payload
		const payload: LoginConfirm = await Joi.object<LoginConfirm>({
			phone: Joi.object<PhoneIdentifiers>({
				country_code: Joi.number().required(),
				number: Joi.number().required(),
			}).required(),
			otp_code: Joi.number().required(),
		}).validateAsync(req.body);
		const result = await OTPCodeService.verify<SanitizedUser>(
			REDIS_KEYS.otp_code(formatPhone(payload.phone)),
			payload.otp_code
		);
		if (!result) return next(new InvalidCredentialsError("code expired or wrong"));
		const { accessToken, refreshToken } = await TokenService.issue({
			name: result.name,
			user_id: result.id.toString(),
		});
		return res.send(createSuccessResponse({ accessToken, refreshToken }));
	} catch (err) {
		return next(err);
	}
};

export const logout: IController = async (req, res, next) => {
	try {
		await TokenService.deleteUserRefreshTokens(req.user?.id);
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};
