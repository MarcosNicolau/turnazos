import amqp from "amqplib";
import { ENV_VARS } from "config/env";

export const amqpLoader = async () => {
	try {
		const connection = await amqp.connect(ENV_VARS.RABBIT_MQ_URL || "");
		const channel = await connection.createChannel();
		return channel;
	} catch (err) {
		return Promise.reject(err);
	}
};
