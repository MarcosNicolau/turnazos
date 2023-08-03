import { NotificationConsumerMsg } from "type/amqp/notification";

export type Notification = NotificationConsumerMsg;

export type NotificationVias = keyof Notification["via"];
