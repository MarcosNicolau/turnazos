import { redisClient } from "config/redis";

export class RedisClientService {
	static hashes = {
		set: async (key: string, field: string | number, value: string | number) =>
			await redisClient.hSet(key, field, value),
		setMultiple: async (
			key: string,
			values: Record<string | number, string | number | Buffer>
		) => redisClient.hSet(key, values),
		fieldExists: async (key: string, field: string) => await redisClient.hExists(key, field),
		getSingleField: async (key: string, field: string) => await redisClient.hGet(key, field),
		getAllFields: async <T extends { [key in string]: string }>(key: string): Promise<T> =>
			//@ts-expect-error library does not allow to set a typed response type, so we refrain to this
			await redisClient.hGetAll(key),
		deleteField: async (key: string, field: string) => await redisClient.hDel(key, field),
		deleteHash: async (key: string) => await redisClient.del(key),
	};

	static lists = {
		pushFront: async (key: string, elements: string[]) =>
			await redisClient.lPush(key, elements),
		pushBack: async (key: string, elements: string[]) => await redisClient.rPush(key, elements),
		popFront: async (key: string) => await redisClient.rPop(key),
		popBack: async (key: string) => await redisClient.rPop(key),
		length: async (key: string) => await redisClient.lLen(key),
		getElementPos: async (key: string, element: any) => await redisClient.lPos(key, element),
		getElements: async (key: string, start: number, end: number) =>
			await redisClient.lRange(key, start, end),
		removeElements: async (key: string, count: number, element: any) =>
			await redisClient.lRem(key, count, element),
	};

	static expire = {
		expire: async (key: string, timeInSeconds: number) =>
			await redisClient.expire(key, timeInSeconds),
	};

	static deleteKey = async (key: string) => await redisClient.del(key);
}
