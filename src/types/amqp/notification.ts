import { Message } from "whatsapp-business";

export type NotificationVia = "email" | "whatsapp" | "sms" | "app";

export type NotificationConsumerMsg = {
	via: {
		whatsapp?: {
			content: Message;
			type?: "otp_code" | "authentication";
		};
		email?: {
			admin_fail_warning?: {
				err: string;
			};
			business_request_verification?: {
				business_id: number;
				business_name: string;
				files: string[];
			};
			other?: {
				to: string[];
				text: string;
				subject: string;
			};
		};
		//We don't support app notifications yet, but the service will store the user information with its id
		app?: {
			user_id: string;
			type?: "business_verification_status";
		};
	};
};
