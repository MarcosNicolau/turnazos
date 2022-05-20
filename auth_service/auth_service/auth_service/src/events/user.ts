import { RedisClientService } from "./../services/redis";
import { EventEmitter } from "events";
import {
	UserRedisSetEventArgs,
	UserRedisDeleteEventArgs,
	UserRedisUpdateExpirationEventArgs,
} from "types/user";
import { REDIS_EXPIRY_TIMES_IN_DAYS, REDIS_KEYS } from "constants/redis";
import { EVENT_EMITTER_NAMES } from "constants/events";
import { daysToSeconds } from "utils/date";
import { LoggerService } from "services/logger";

export const userEvents = (eventEmitter: EventEmitter) => {
	const redisSet = ({ id, ...args }: UserRedisSetEventArgs) => {
		setImmediate(async () => {
			try {
				const key = REDIS_KEYS.user(id);
				//@ts-expect-error if the key is not passed then redis won't update
				await RedisClientService.hashes.setMultiple(key, args);
				await RedisClientService.expire.expire(
					key,
					daysToSeconds(REDIS_EXPIRY_TIMES_IN_DAYS.USER)
				);
			} catch (err: any) {
				LoggerService.sendLog("caching a user", {
					level: "error",
					description: err?.description || err,
					stack: err.stack || new Error().stack,
				});
			}
		});
	};

	const redisUpdateExpiration = ({ id }: UserRedisUpdateExpirationEventArgs) => {
		setImmediate(async () => {
			try {
				await RedisClientService.expire.expire(
					REDIS_KEYS.user(id),
					daysToSeconds(REDIS_EXPIRY_TIMES_IN_DAYS.USER)
				);
			} catch (err: any) {
				LoggerService.sendLog("updating user caching expiration", {
					level: "error",
					description: err?.description || err,
					stack: err?.stack || new Error().stack,
				});
			}
		});
	};

	const redisDel = ({ id }: UserRedisDeleteEventArgs) => {
		setImmediate(async () => {
			try {
				await RedisClientService.hashes.deleteHash(REDIS_KEYS.user(id));
			} catch (err: any) {
				LoggerService.sendLog("deleting user cache", {
					level: "error",
					description: err?.description,
					stack: err?.stack || new Error().stack,
				});
			}
		});
	};

	eventEmitter.on(EVENT_EMITTER_NAMES.USER.REDIS_SET, redisSet);
	eventEmitter.on(EVENT_EMITTER_NAMES.USER.REDIS_DELETE, redisDel);
	eventEmitter.on(EVENT_EMITTER_NAMES.USER.REDIS_UPDATE_EXPIRATION, redisUpdateExpiration);
};
