import { ReqUser } from "types/express";

declare global {
	namespace Express {
		interface Request {
			user: ReqUser;
		}
	}
}
