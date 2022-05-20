import { ENV_VARS } from "config/env";
import { EventEmitter } from "events";
import { Channel } from "amqplib";
import { EVENT_EMITTER_NAMES } from "constants/events";
import { AMQP } from "constants/amqp";
import { AMQPSendLogEventArgs } from "type/events/amqp";

export const amqpEvents = async (eventEmitter: EventEmitter, channel: Channel) => {
	try {
		await channel.assertExchange(AMQP.EXCHANGE.logger, "direct", {
			durable: false,
		});
		await channel.assertQueue(AMQP.QUEUE.logging, { autoDelete: false, durable: true });
		//Bind the logging queue to the exchange
		await channel.bindQueue(AMQP.QUEUE.logging, AMQP.EXCHANGE.logger, "");
	} catch (err) {
		console.error(`error in amqp events, err: ${err}`);
	}

	eventEmitter.on(EVENT_EMITTER_NAMES.AMQP.SEND_LOG, (msg: AMQPSendLogEventArgs) => {
		//Show logs in local
		if (ENV_VARS.NODE_ENV !== "production")
			console.log(`${msg.level?.toUpperCase()}: ${msg.message}`);
		channel.publish(AMQP.EXCHANGE.logger, "", Buffer.from(JSON.stringify(msg)), {
			appId: "user_service",
		});
	});
};
