import crypto from "crypto";
export const generateRandomKey = (bytes?: number) =>
	crypto.randomBytes(bytes || 20).toString("hex");

export const generateRandomCode = (length = 6) =>
	Math.random()
		.toString()
		.substring(2, length + 2);
