export const REDIS_KEYS = {
	user: (id: string | number) => `user_${id}`,
} as const;

export const REDIS_EXPIRY_TIMES_IN_DAYS = {
	USER: 15,
};

export type RedisKeysUnion = Omit<typeof REDIS_KEYS[keyof typeof REDIS_KEYS], "user">;
