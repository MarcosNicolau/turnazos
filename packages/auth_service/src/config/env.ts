import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS = {
	PORT: process.env.PORT,
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
	RABBIT_MQ_URL: process.env.RABBIT_MQ_URL,
	NODE_ENV: process.env.NODE_ENV,
} as const;
