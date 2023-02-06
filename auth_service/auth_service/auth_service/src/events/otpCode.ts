import { EVENTS } from "constants/events";
import { EventEmitter } from "events";
import { LoggerService } from "services/logger";
import { RedisClientService } from "services/redis";
import { hoursToSeconds } from "utils/date";

export const otpCodeEvents = (eventEmitter: EventEmitter) => {
	//Used when the user has generating too many codes in a short amount of time
	const blackListIdFromGeneratingNewCodes = (key: string) => {
		setImmediate(async () => {
			try {
				await RedisClientService.hashes.set(key, "blacklisted", "true");
				//Don't let the user generate new tokens for the next 12 hours
				await RedisClientService.expire.expire(key, hoursToSeconds(12));
			} catch (err: any) {
				LoggerService.sendLog(
					"error while blacklisting an id from creating new otp codes",
					{
						stack: err?.stack || new Error().stack,
						level: "error",
					}
				);
			}
		});
	};

	const createdCode = (key: string) => {
		setImmediate(async () => {
			try {
				const res = await RedisClientService.hashes.getSingleField(key, "count");
				await RedisClientService.hashes.setMultiple(key, {
					count: Number(res || 0) + 1,
					createdAt: Date.now(),
				});
			} catch (err: any) {
				LoggerService.sendLog("error while saving id otp code creation", {
					stack: err?.stack || new Error().stack,
					level: "error",
				});
			}
		});
	};

	eventEmitter.on(EVENTS.OTP_CODE.CREATED_CODE, createdCode);
	eventEmitter.on(EVENTS.OTP_CODE.BLACKLIST_ID, blackListIdFromGeneratingNewCodes);
};
