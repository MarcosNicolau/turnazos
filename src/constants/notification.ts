import { ENV_VARS } from "./../config/env";
export const EMAIL_TEMPLATES = {
	admin_fail_warning: {
		to: ENV_VARS.ADMIN_EMAILS,
		templateId: "f7f8f8db25944a879e707cfe2e32cc68",
	},
	business_requested_verification: {
		templateId: "",
		to: ENV_VARS.ADMIN_EMAILS,
	},
} as const;
