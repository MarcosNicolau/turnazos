import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS = {
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	UPLOAD_TOKEN: process.env.UPLOAD_TOKEN,
	FILES_BASE_DIR_PUBLIC: process.env.FILES_BASE_DIR_PUBLIC,
	FILES_BASE_DIR_PRIVATE: process.env.FILES_BASE_DIR_PRIVATE,
	//Must be a comma separated list
	ALLOWED_IPs: (process.env.ALLOWED_IPS || "").split(", "),
};
