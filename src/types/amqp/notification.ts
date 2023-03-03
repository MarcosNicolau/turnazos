import { Message } from "whatsapp-business";

export type NotificationVia = "email" | "whatsapp" | "sms" | "app";

export type NotificationConsumerMsg = {
	via: {
		whatsapp?: {
			content: Message;
			template?: string;
		};
		email?: {
			to: string[] | "admin";
			text?: string;
			subject?: string;
			template?: {
				id: string;
				data: Record<string | number, any>;
			};
		};
		//We don't support app notifications yet, but the service will store the user information with its id
		app?: {
			user_id: string;
			header: string;
			body: string;
		};
	};
};
