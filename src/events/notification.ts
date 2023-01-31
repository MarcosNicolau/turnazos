import { EVENTS } from "constants/events";
import { EventEmitter } from "events";
import { NotificationConsumerMsg } from "type/amqp/notification";
import { NotificationService } from "services/notification";

export const notificationEvents = (eventEmitter: EventEmitter) => {
	const notificationService = new NotificationService();
	eventEmitter.on(EVENTS.NOTIFICATION.SEND, async (msg: NotificationConsumerMsg) => {
		setImmediate(async () => {
			await notificationService.sendNotification(msg);
		});
	});
};
