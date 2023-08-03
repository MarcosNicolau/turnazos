import { Channel } from "amqplib";
import { AMQP } from "constants/amqp";
import { NotificationConsumerMsg } from "type/amqp/notification";
import { EventEmitterService } from "services/eventEmitter";

export const createNotificationConsumer = async (channel: Channel) => {
	await channel.assertExchange(AMQP.EXCHANGE.NOTIFICATION, "direct", { durable: false });
	const assertion = await channel.assertQueue("", { durable: false, exclusive: true });
	await channel.bindQueue(assertion.queue, AMQP.EXCHANGE.NOTIFICATION, "");

	channel.consume(assertion.queue, async (msg) => {
		if (!msg) return;
		const parsedMsg: NotificationConsumerMsg = JSON.parse(msg.content.toString() || "{}");
		EventEmitterService.sendNotification(parsedMsg);
		channel.ack(msg);
	});
};
