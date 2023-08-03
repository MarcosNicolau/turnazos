import { REDIS_KEYS } from "constants/redis";
import { createErrorResponse } from "utils/http";
import { IController } from "types/express";
import { UnknownError } from "utils/error";
import { OTPCodeService } from "services/OTPCode";

// This middleware decode the info passed from the auth service when there is a 2FA authentication
// And attaches the information to the req object
export const validateOTPCode: IController = async (req, res, next) => {
	const id = req.user?.id;
	const code = req.body.otp_code;
	const sendAuthError = () =>
		res.status(401).send(createErrorResponse(res.statusCode, "invalid otp_code"));
	if (!code || !id) return sendAuthError();

	try {
		const result = await OTPCodeService.verify(REDIS_KEYS.otp_code(id), code);
		if (!result) return sendAuthError();
		return next();
	} catch (err) {
		return next(new UnknownError());
	}
};
