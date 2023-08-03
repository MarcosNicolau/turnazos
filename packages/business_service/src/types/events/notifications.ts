import { Message } from "whatsapp-business";

export type SendNotificationArgs = {
	//Pass when you want to store the notification
	store?: {
		user_id: string;
		business_id?: string;
		type: string;
		header: string;
		body: string;
	};
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
			title: string;
			subtitle?: string;
			body: string;
			data?: Record<string, any>;
		};
	};
};
