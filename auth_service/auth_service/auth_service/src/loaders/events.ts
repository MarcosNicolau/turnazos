import { Channel } from "amqplib";
import { eventEmitter } from "config/eventEmitter";
import { loggerEvents, userEvents, notificationEvents, otpCodeEvents } from "../events";

export const eventsLoaders = async (amqpChannel: Channel) => {
	loggerEvents(eventEmitter, amqpChannel);
	userEvents(eventEmitter, amqpChannel);
	notificationEvents(eventEmitter, amqpChannel);
	otpCodeEvents(eventEmitter);
	return;
};
