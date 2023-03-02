import dotenv from "dotenv";
dotenv.config();
export const ENV_VARS = {
	PORT: process.env.PORT,
	RABBIT_MQ_URL: process.env.RABBIT_MQ_URL,
	NODE_ENV: process.env.NODE_ENV || "dev",
	WABA_ACCOUNT_ID: process.env.WABA_ACCOUNT_ID,
	WABA_PHONE_ID: process.env.WABA_PHONE_ID,
	WABA_API_TOKEN: process.env.WABA_API_TOKEN,
	SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
	EMAIL_FROM: process.env.EMAIL_FROM,
	ADMIN_EMAILS: (process.env.EMAIL_FROM || "").split(", "),
} as const;
