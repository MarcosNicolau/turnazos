import Joi from "joi";
import { UserService } from "services/user";
import { IController } from "type/express";
import { PhoneIdentifiers } from "types/user";
import { createSuccessResponse } from "utils/http";

interface ChangePasswordPayload {
	old_password: string;
	new_password: string;
	otp_code: number;
}

export const changePassword: IController = async (req, res, next) => {
	const { id } = req.user;
	try {
		const payload: ChangePasswordPayload = await Joi.object<ChangePasswordPayload>({
			old_password: Joi.string().required(),
			new_password: Joi.string().required(),
		})
			.unknown(true)
			.validateAsync(req.body);

		await new UserService({ id }).changePassword(payload);
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};

interface ForgotPasswordPayload {
	password: string;
	phone: PhoneIdentifiers;
	otp_code: number;
}

export const forgotPassword: IController = async (req, res, next) => {
	try {
		const payload: ForgotPasswordPayload = await Joi.object<ForgotPasswordPayload>({
			password: Joi.string().required(),
			otp_code: Joi.number().required(),
			phone: Joi.object<PhoneIdentifiers>({
				country_code: Joi.number().required(),
				number: Joi.number().required(),
			}),
		})
			.unknown(true)
			.validateAsync(req.body);
		await UserService.forgotPassword({ phone: payload.phone, password: payload.password });
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};
