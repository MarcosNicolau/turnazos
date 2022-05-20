export const EVENT_EMITTER_NAMES = {
	USER: {
		REDIS_SET: "user_redis_set",
		REDIS_DELETE: "user_redis_delete",
		REDIS_UPDATE_EXPIRATION: "user_redis_update_expiration",
	},
	AMQP: {
		SEND_LOG: "amqp_send_log",
	},
};
