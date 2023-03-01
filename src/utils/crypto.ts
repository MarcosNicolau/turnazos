import crypto from "crypto";
export const generateRandomKey = (bytes?: number) =>
	crypto.randomBytes(bytes || 20).toString("hex");

export const generateRandomCode = (length = 6) =>
	Math.random()
		.toString()
		.substring(2, length + 2);

/**
 * Uses the buffer to convert the string to base64.
 *
 * The buffer ignores any character that does not belong to the string, so we re-convert it to base64 and check the equality with the original string
 */
export const isBase64 = (str: string) => Buffer.from(str, "base64").toString("base64") === str;
