import { ENV_VARS } from "config/env";
import { EventEmitter } from "events";
import { Channel } from "amqplib";
import { EVENT_EMITTER_NAMES } from "constants/events";
import { AMQP } from "constants/amqp";
import { SendLogEventArgs } from "type/events/logger";

export const loggerEvents = async (eventEmitter: EventEmitter, channel: Channel) => {
	try {
		await channel.assertExchange(AMQP.EXCHANGE.logger, "direct", {
			durable: false,
		});
	} catch (err) {
		console.error(`error in amqp events, err: ${err}`);
	}

	eventEmitter.on(EVENT_EMITTER_NAMES.AMQP.SEND_LOG, (msg: SendLogEventArgs) => {
		//Show logs in local
		if (ENV_VARS.NODE_ENV !== "production")
			console.log(`${msg.level?.toUpperCase()}: ${msg.message}`);
		channel.publish(AMQP.EXCHANGE.logger, msg.level, Buffer.from(JSON.stringify(msg)), {
			appId: "user_service",
		});
	});
};
