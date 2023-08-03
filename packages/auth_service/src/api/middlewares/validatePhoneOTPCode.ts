import { formatPhone } from "./../../utils/phone";
import { REDIS_KEYS } from "./../../constants/redis";
import { createErrorResponse } from "utils/http";
import { IController } from "types/express";
import { OTPCodeService } from "services/OTPCode";
import { PhoneIdentifiers } from "type/user";
import Joi from "joi";

interface Payload {
	phone: PhoneIdentifiers;
	otp_code: number;
}

// This middleware decode the info passed from the auth service when there is a 2FA authentication
// And attaches the information to the req object
/**
 * This middleware expects to have a phone: PhoneIdentifiers field and otp_code field attached in the body
 */
export const validatePhoneOTPCode: IController = async (req, res, next) => {
	const sendAuthError = () =>
		res.status(401).send(createErrorResponse(res.statusCode, "invalid otp_code"));

	try {
		const payload: Payload = await Joi.object<Payload>({
			phone: Joi.object<PhoneIdentifiers>({
				country_code: Joi.number().required(),
				number: Joi.number().required(),
			}),
		})
			.unknown(true)
			.validateAsync(req.body);

		const result = await OTPCodeService.verify(
			REDIS_KEYS.otp_code(formatPhone(payload.phone)),
			payload.otp_code
		);
		if (!result) return sendAuthError();
		return next();
	} catch (err) {
		return next(sendAuthError());
	}
};
