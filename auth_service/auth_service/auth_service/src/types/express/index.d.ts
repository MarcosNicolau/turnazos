import { ReqUser } from "types/controller";

declare global {
	namespace Express {
		interface Request {
			user: ReqUser;
		}
	}
}
