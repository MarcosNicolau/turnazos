import { ENV_VARS } from "config/env";
import { createClient } from "redis";

export const redisClient = createClient({
	name: "business_service",
	socket: {
		port: Number(ENV_VARS.REDIS_PORT),
		host: ENV_VARS.REDIS_HOST,
	},
	password: ENV_VARS.REDIS_PASSWORD,
	database: 1,
});
