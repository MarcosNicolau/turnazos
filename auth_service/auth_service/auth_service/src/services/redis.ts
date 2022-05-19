import { redisClient } from "config/redis";

export class RedisClientService {
	static hashes = {
		set: async (key: string, field: string | number, value: string | number) =>
			await redisClient.hSet(key, field, value),
		setMultiple: async (
			key: string,
			values: Record<string | number, string | number | Buffer>
			//@ts-expect-error hset requires json data
		) => redisClient.hSet(key, JSON.stringify(values)),
		fieldExists: async (key: string, field: string) => await redisClient.hExists(key, field),
		getSingleField: async (key: string, field: string) => await redisClient.hGet(key, field),
		getAllFields: async (key: string) => await redisClient.hGetAll(key),
		deleteField: async (key: string, field: string) => await redisClient.hDel(key, field),
		deleteHash: async (key: string) => await redisClient.del(key),
	};

	static expire = {
		expire: async (key: string, timeInSeconds: number) =>
			await redisClient.expire(key, timeInSeconds),
	};
}
