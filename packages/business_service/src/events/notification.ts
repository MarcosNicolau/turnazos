import { AMQP } from "constants/amqp";
import { Channel } from "amqplib";
import { EVENTS } from "constants/events";
import EventEmitter from "events";
import { LoggerService } from "services/logger";
import { SendNotificationArgs } from "type/events/notification";

export const notificationEvents = async (eventEmitter: EventEmitter, amqpChannel: Channel) => {
	try {
		await amqpChannel.assertExchange(AMQP.EXCHANGE.NOTIFICATION, "direct", { durable: false });

		const send = (msg: SendNotificationArgs) => {
			setImmediate(async () => {
				const res = amqpChannel.publish(
					AMQP.EXCHANGE.NOTIFICATION,
					"",
					Buffer.from(JSON.stringify(msg))
				);
				if (res) LoggerService.sendLog("notification to user sent");
				if (!res) LoggerService.sendLog("could not send notification to user");
			});
		};

		eventEmitter.on(EVENTS.NOTIFICATION.SEND, send);
	} catch (err) {
		return Promise.reject(err);
	}
};
