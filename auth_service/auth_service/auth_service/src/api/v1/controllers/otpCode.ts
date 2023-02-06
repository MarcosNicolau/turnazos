import { formatPhone } from "utils/phone";
import { PhoneIdentifiers } from "types/user";
import Joi from "joi";
import { OTPCodeService } from "services/OTPCode";
import { IController } from "type/express";
import { createSuccessResponse } from "utils/http";
import { EventEmitterService } from "services/eventEmitter";
import { UserService } from "services/user";

const sendCodeNotification = (phone: PhoneIdentifiers, code: number | string) =>
	EventEmitterService.notification.send({
		type: "otp_code",
		via: {
			//@ts-expect-error ignore this, the notification service handles it
			whatsapp: {
				to: formatPhone(phone),
				type: "text",
				text: { body: `Your code is ${code}` },
			},
		},
	});

export const generateOTPCode: IController = async (req, res, next) => {
	const { id } = req.user;
	try {
		const user = await UserService.get(id);
		const code = await OTPCodeService.generate(id.toString());
		sendCodeNotification(user.phone, code);
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};

export const generateOTPCodeWithPhone: IController = async (req, res, next) => {
	try {
		const payload: PhoneIdentifiers = await Joi.object<PhoneIdentifiers>({
			number: Joi.number().required(),
			country_code: Joi.number().required(),
		}).validateAsync(req.body);
		const code = await OTPCodeService.generate(formatPhone(payload));
		sendCodeNotification(payload, code);
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};
