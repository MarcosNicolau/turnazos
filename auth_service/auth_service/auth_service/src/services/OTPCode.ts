import { generateRandomKey } from "./../utils/crypto";
import { getDateDiffInMinutes } from "./../utils/date";
import { REDIS_EXPIRY_TIMES_IN_SECONDS, REDIS_KEYS } from "constants/redis";
import { generateRandomCode } from "../utils/crypto";
import { AppError } from "utils/error";
import { EventEmitterService, RedisClientService } from "services";

interface GenerateCodeOpts {
	type: "token" | "number";
	length: number;
}

export class OTPCodeService {
	/**
	 * @param id to which relate the hash with the code, for example: the user id
	 * @param fields to attach, which will be retrieved upon verification
	 */
	static generate = async (
		id: string,
		fields: object = {},
		opts: GenerateCodeOpts = { type: "number", length: 6 }
	) => {
		const error = (message: string) =>
			Promise.reject(
				new AppError({
					message,
					httpCode: 403,
				})
			);

		const key = REDIS_KEYS.otp_code(id);
		try {
			const res = await RedisClientService.hashes.getAllFields(key);

			//Before generating a new OTP code, we must verify if the user is allowed
			if (res) {
				//Check that it is not blacklisted
				if (res.blacklisted) return error("code generation limit reached, try again later");

				//If the count is higher than 5, then block the user from generating new codes for an hour
				if (Number(res.count) >= 5) {
					EventEmitterService.otpCode.blacklistKey(key);
					return error("code generation limit reached, try again later");
				}

				//If one has been created recently, check that it has passed at least 1 minute
				const dateDiff = getDateDiffInMinutes(
					new Date(Number(res.createdAt)),
					new Date(Date.now())
				);
				if (dateDiff <= 1) return error("wait before generating a new code");
			}
			const code =
				opts.type === "number"
					? generateRandomCode(opts.length)
					: generateRandomKey(opts.length);
			await RedisClientService.hashes.setMultiple(key, {
				code,
				...fields,
			});
			await RedisClientService.expire.expire(key, REDIS_EXPIRY_TIMES_IN_SECONDS.OTP_CODE);
			EventEmitterService.otpCode.codeCreated(key);
			return code;
		} catch (err) {
			return Promise.reject(err);
		}
	};
	/**
	 * @param id the previous id set when generated the code
	 * @param code the code to verify
	 * @returns the provided fields when generating the code if the code is correct
	 */
	static verify = async <T extends object>(key: string, code: number): Promise<T | null> => {
		try {
			const fields: T & { code: string } = await RedisClientService.hashes.getAllFields(key);
			if (Number(fields.code) === code) return fields;
			return null;
		} catch (err) {
			return Promise.reject(err);
		}
	};
}
