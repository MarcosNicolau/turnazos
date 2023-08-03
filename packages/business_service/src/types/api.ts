export type APIResponse<Result> = {
	result: Result;
	message: string;
	statusCode: number;
	error: boolean;
};
