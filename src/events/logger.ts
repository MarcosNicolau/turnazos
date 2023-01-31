import { Channel } from "amqplib";
import { EventEmitter } from "events";
import { AMQP } from "constants/amqp";
import { EVENTS } from "constants/events";
import { ENV_VARS } from "config/env";
import { SendLogEventArgs } from "type/events/logger";

export const loggerEvents = async (eventEmitter: EventEmitter, channel: Channel) => {
	try {
		await channel.assertExchange(AMQP.EXCHANGE.LOGGER, "direct", { durable: false });
	} catch (err) {
		console.log(`There was an error while asserting the logger exchange, err: ${err}`);
	}

	eventEmitter.on(EVENTS.LOGGER.SEND_LOG, (msg: SendLogEventArgs) => {
		//Show logs in local
		if (ENV_VARS.NODE_ENV !== "production")
			console.log(`${msg.level?.toUpperCase()}: ${msg.message}`);
		channel.publish(AMQP.EXCHANGE.LOGGER, msg.level, Buffer.from(JSON.stringify(msg)), {
			appId: "notification_service",
		});
	});
};
