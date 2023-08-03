export const EVENTS = {
	LOGGER: {
		SEND_LOG: "logger_send_log",
	},
	BUSINESS: {
		REQUEST_VERIFICATION: "business_request_verification",
		VERIFICATION_STATUS_UPDATE: "business_verification_status_update",
		CLIENT_GRANT_ACCESS: "business_client_grant_access",
	},
	NOTIFICATION: {
		SEND: "notification_send",
	},
} as const;
