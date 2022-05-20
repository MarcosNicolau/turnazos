import { prisma } from "config/prisma";
import { redisClient } from "config/redis";
import { LoggerService } from "services/logger";

export const dbLoader = async () => {
	const sendLog = LoggerService.sendLog;
	try {
		await redisClient.connect();
		sendLog("redis connection successful");
	} catch (err) {
		sendLog(`there was a problem while connecting to redis, err: ${err}`, { level: "error" });
	}
	try {
		await prisma.$connect();
		console.log("Prisma connection successful");
		sendLog("Prisma connection successful");
	} catch (err) {
		sendLog(`there was a problem while connecting to prisma, err: ${err}`, { level: "error" });
	}

	return;
};
