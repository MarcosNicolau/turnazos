import { EventEmitterService } from "services";
import Joi from "joi";
import { LoggerService } from "services/logger";
import { UserService } from "services/user";
import { passwordValidationSchema } from "services/user/helpers";
import { IController } from "type/express";
import { CreateUserPayload } from "type/user";
import { createSuccessResponse } from "utils/http";

interface RegisterUserPayload extends CreateUserPayload {
	otp_code: number;
}

export const registerUser: IController = async (req, res, next) => {
	try {
		LoggerService.sendLog("received a request to create a user...");
		const { otp_code, ...payload }: RegisterUserPayload = await Joi.object<RegisterUserPayload>(
			{
				phone: Joi.object<CreateUserPayload["phone"]>({
					country_code: Joi.number().required(),
					number: Joi.number().required(),
				}),
				password: passwordValidationSchema.required(),
				name: Joi.string().required(),
				otp_code: Joi.number().required(),
			}
		).validateAsync(req.body);
		//If its correct, create the user
		const user = await UserService.create({
			...payload,
			phone: {
				...payload.phone,
				number: Number(payload.phone.number),
				country_code: Number(payload.phone.country_code),
			},
		});
		EventEmitterService.user.publishUserCreation(user);
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};
