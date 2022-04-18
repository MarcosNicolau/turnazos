import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS = {
	PORT: process.env.PORT,
	RABBIT_MQ_URL: process.env.RABBIT_MQ_URL,
	NODE_ENV: process.env.NODE_ENV || "dev",
} as const;
