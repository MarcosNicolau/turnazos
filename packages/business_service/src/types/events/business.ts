import { BusinessVerificationStatus } from "constants/business";

export type BusinessRequestVerificationTemplateData = {
	business_id: number;
	business_name: string;
	files: string[];
};

export type BusinessVerificationStatusUpdateArgs = {
	user_id: string;
	status: BusinessVerificationStatus;
	business_name: string;
};

export type BusinessClientGrantAccessArgs = {
	user_id: string;
	business_name: string;
	access_granted: boolean;
};
