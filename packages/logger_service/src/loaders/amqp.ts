import { logger } from "config/logger";
import amqp from "amqplib";
import { ENV_VARS } from "config/env";
import { createLoggerConsumer } from "amqp";

export const amqpLoader = async () => {
	try {
		const connection = await amqp.connect(ENV_VARS.RABBIT_MQ_URL || "");
		const channel = await connection.createChannel();
		createLoggerConsumer(channel);
	} catch (err) {
		logger.error(`could not connect to rabbit mq, err: ${JSON.stringify(err)}`);
		return Promise.reject(err);
	}
};
