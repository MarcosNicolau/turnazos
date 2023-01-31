import { Channel } from "amqplib";
import { eventEmitter } from "config/eventEmitter";
import { loggerEvents, userEvents } from "../events";

export const eventsLoaders = async (amqpChannel: Channel) => {
	await loggerEvents(eventEmitter, amqpChannel);
	userEvents(eventEmitter);
	return;
};
