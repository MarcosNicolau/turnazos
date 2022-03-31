import { prisma } from "config/prisma";
import { redisClient } from "config/redis";

export const dbLoader = async () => {
	try {
		await redisClient.connect();
		console.log("Redis connection successful");
	} catch (err) {
		console.error(`there was a problem while connecting to redis, err: ${err}`);
	}
	try {
		await prisma.$connect();
		console.log("Prisma connection successful");
	} catch (err) {
		console.error(`there was a problem while connecting to prisma, err: ${err}`);
	}

	return;
};
