import { minutesToSeconds } from "utils/date";

export const REDIS_KEYS = {
	otp_code: (id: string | number) => `otp_code_${id}`,
	refresh_token: (user_id: number | string) => `refresh_tokens_${user_id}`,
} as const;

export const REDIS_EXPIRY_TIMES_IN_SECONDS = {
	OTP_CODE: minutesToSeconds(5),
};

export type RedisKeysUnion = Omit<typeof REDIS_KEYS[keyof typeof REDIS_KEYS], "user">;
