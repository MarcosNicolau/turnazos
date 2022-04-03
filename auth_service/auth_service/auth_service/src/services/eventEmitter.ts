import { eventEmitter } from "config/eventEmitter";
import { EVENT_EMITTER_NAMES } from "constants/events";
import {
	UserRedisDeleteEventArgs,
	UserRedisSetEventArgs,
	UserRedisUpdateExpirationEventArgs,
} from "types/user";

export class EventEmitterService {
	static user = {
		redisSet: (args: UserRedisSetEventArgs) =>
			eventEmitter.emit(EVENT_EMITTER_NAMES.USER.REDIS_SET, args),
		redisDel: (args: UserRedisDeleteEventArgs) =>
			eventEmitter.emit(EVENT_EMITTER_NAMES.USER.REDIS_DELETE, args),
		redisUpdateExpiration: (args: UserRedisUpdateExpirationEventArgs) =>
			eventEmitter.emit(EVENT_EMITTER_NAMES.USER.REDIS_UPDATE_EXPIRATION, args),
	};
}
