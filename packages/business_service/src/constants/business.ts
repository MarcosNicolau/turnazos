export const BUSINESS_VERIFICATION_STATUS = {
	ACCEPTED: "accepted",
	IN_REVISION: "in_revision",
	FAILED: "failed",
} as const;

export type BusinessVerificationStatus =
	(typeof BUSINESS_VERIFICATION_STATUS)[keyof typeof BUSINESS_VERIFICATION_STATUS];
