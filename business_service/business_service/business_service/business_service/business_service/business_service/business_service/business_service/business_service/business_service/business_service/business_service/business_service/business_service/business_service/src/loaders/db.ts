import { redisClient } from "config/redis";
import { prisma } from "./../config/prisma";

export const dbLoader = async () => {
	try {
		await prisma.$connect();
		await redisClient.connect();
	} catch (err) {
		Promise.reject(err);
	}
};
