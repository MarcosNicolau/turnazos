import amqp from "amqplib";
import { ENV_VARS } from "config/env";
import { AMQP } from "constants/amqp";

export const amqpLoader = async () => {
	try {
		const connection = await amqp.connect(ENV_VARS.RABBIT_MQ_URL || "");
		const channel = await connection.createChannel();
		//Assert all the exchanges we are using
		await channel.assertExchange(AMQP.EXCHANGE.LOGGER, "direct", { durable: false });
		await channel.assertExchange(AMQP.EXCHANGE.NOTIFICATION, "direct", { durable: false });
		await channel.assertExchange(AMQP.EXCHANGE.USER, "direct", { durable: true });
		return channel;
	} catch (err) {
		return Promise.reject(err);
	}
};
