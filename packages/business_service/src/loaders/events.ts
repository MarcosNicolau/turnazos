import { Channel } from "amqplib";
import { eventEmitter } from "config/eventEmitter";
import { loggerEvents, notificationEvents } from "../events";

export const eventsLoader = async (amqpChannel: Channel) => {
	try {
		await loggerEvents(eventEmitter, amqpChannel);
		await notificationEvents(eventEmitter, amqpChannel);
	} catch (err) {
		return Promise.reject(err);
	}
};
