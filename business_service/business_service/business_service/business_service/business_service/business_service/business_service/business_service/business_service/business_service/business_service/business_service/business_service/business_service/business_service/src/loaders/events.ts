import { Channel } from "amqplib";
import { eventEmitter } from "config/eventEmitter";
import { loggerEvents } from "../events";

export const eventsLoader = async (amqpChannel: Channel) => {
	try {
		await loggerEvents(eventEmitter, amqpChannel);
	} catch (err) {
		return Promise.reject(err);
	}
};
