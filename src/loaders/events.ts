import { Channel } from "amqplib";
import { eventEmitter } from "config/eventEmitter";
import { loggerEvents, notificationEvents } from "../events";

export const eventsLoader = async (channel: Channel) => {
	try {
		await loggerEvents(eventEmitter, channel);
	} catch (err) {
		return Promise.reject(err);
	}
	notificationEvents(eventEmitter);
};
