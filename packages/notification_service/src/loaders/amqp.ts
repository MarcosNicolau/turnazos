import { createNotificationConsumer } from "amqp";
import amqp from "amqplib";
import { ENV_VARS } from "config/env";

export const amqpLoader = async () => {
	try {
		const connection = await amqp.connect(ENV_VARS.RABBIT_MQ_URL || "");
		const channel = await connection.createChannel();
		//Here we would call the different consumer and producer passing the channel as an arg
		await createNotificationConsumer(channel);
		return channel;
	} catch (err) {
		console.log(
			`there was an error while connecting to Rabbit MQ, err: ${JSON.stringify(err)}`
		);
		return Promise.reject(err);
	}
};
