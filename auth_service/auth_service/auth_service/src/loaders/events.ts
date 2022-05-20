import { Channel } from "amqplib";
import { eventEmitter } from "config/eventEmitter";
import * as events from "../events";

export const eventsLoaders = async (amqpChannel: Channel) => {
	for await (const event of Object.values(events)) {
		await event(eventEmitter, amqpChannel);
	}
	return;
};
