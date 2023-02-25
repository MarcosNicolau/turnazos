import { SendLogEventArgs } from "./../types/events/logger";
import { Channel } from "amqplib";
import EventEmitter from "events";
import { EVENTS } from "constants/events";
import { AMQP } from "constants/amqp";
import { ENV_VARS } from "config/env";

export const loggerEvents = async (eventEmitter: EventEmitter, amqpChannel: Channel) => {
	try {
		//Before publishing to exchange, we have to assert it
		await amqpChannel.assertExchange(AMQP.EXCHANGE.LOGGER, "direct", { durable: false });

		const sendLog = async (msg: SendLogEventArgs) => {
			//Show logs in local too
			if (ENV_VARS.NODE_ENV !== "production")
				console.log(`${msg.level?.toUpperCase()}: ${msg.message}`);
			amqpChannel.publish(AMQP.EXCHANGE.LOGGER, msg.level, Buffer.from(JSON.stringify(msg)), {
				appId: "business_service",
			});
		};

		eventEmitter.on(EVENTS.LOGGER.SEND_LOG, sendLog);
	} catch (err) {
		return Promise.reject(err);
	}
};
