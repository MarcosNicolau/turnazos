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

export default (eventEmitter: EventEmitter) => {
	const redisSet = ({ id, ...args }: UserRedisSetEventArgs) => {
		setImmediate(async () => {
			const key = REDIS_KEYS.user(id);
			//@ts-expect-error if the key is not passed then redis won't update
			await RedisClientService.hashes.setMultiple(key, args);
			await RedisClientService.expire.expire(
				key,
				daysToSeconds(REDIS_EXPIRY_TIMES_IN_DAYS.USER)
			);
		});
	};

	const redisUpdateExpiration = ({ id }: UserRedisUpdateExpirationEventArgs) => {
		setImmediate(async () => {
			await RedisClientService.expire.expire(
				REDIS_KEYS.user(id),
				daysToSeconds(REDIS_EXPIRY_TIMES_IN_DAYS.USER)
			);
		});
	};

	const redisDel = ({ id }: UserRedisDeleteEventArgs) => {
		setImmediate(async () => {
			await RedisClientService.hashes.deleteHash(REDIS_KEYS.user(id));
		});
	};

	eventEmitter.on(EVENT_EMITTER_NAMES.USER.REDIS_SET, redisSet);
	eventEmitter.on(EVENT_EMITTER_NAMES.USER.REDIS_DELETE, redisDel);
	eventEmitter.on(EVENT_EMITTER_NAMES.USER.REDIS_UPDATE_EXPIRATION, redisUpdateExpiration);
};
