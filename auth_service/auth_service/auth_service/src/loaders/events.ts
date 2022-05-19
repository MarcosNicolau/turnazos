import { eventEmitter } from "config/eventEmitter";
import * as events from "../events";

export const eventsLoaders = () => {
	Object.values(events).forEach((event) => event(eventEmitter));
	return;
};
