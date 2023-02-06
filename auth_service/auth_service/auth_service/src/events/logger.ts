import { ENV_VARS } from "config/env";
import { EventEmitter } from "events";
import { Channel } from "amqplib";
import { EVENTS } from "constants/events";
import { AMQP } from "constants/amqp";
import { SendLogEventArgs } from "type/events/logger";

export const loggerEvents = (eventEmitter: EventEmitter, channel: Channel) => {
	eventEmitter.on(EVENTS.LOGGER.SEND, (msg: SendLogEventArgs) => {
		//Show logs in local
		if (ENV_VARS.NODE_ENV !== "production")
			console.log(`${msg.level?.toUpperCase()}: ${msg.message}`);
		channel.publish(AMQP.EXCHANGE.LOGGER, msg.level, Buffer.from(JSON.stringify(msg)), {
			appId: AMQP.APP_ID,
		});
	});
};
