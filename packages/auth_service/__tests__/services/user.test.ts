import { ValidationError } from "utils/error";
import { EventEmitterService } from "./../../src/services/eventEmitter";
import { UserService } from "../../src/services";
import { prismaMock } from "../mocks";
import { CreateUserPayload } from "../../src/types/user";
import { SanitizedUser } from "../../src/types/user";

export const sanitizedUser: SanitizedUser = {
	id: 1,
	name: "Marcos",
	avatar_url: "https://fake_url.com",
	country: "Argentina",
	phone: {
		id: 1,
		country: "AR",
		country_code: 54,
		number: 1121752364,
	},
};

const user: CreateUserPayload = {
	...sanitizedUser,
	password: "COMPLREAREDFSA",
};

describe("make sure the user service is working", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	describe("create user", () => {
		it("should create user, stored in db and emit redis cache", async () => {
			const redisSet = jest.fn(() => false);
			EventEmitterService.user.redisSet = redisSet;

			//@ts-expect-error it returns the user sanitized because of the select
			prismaMock.user.create.mockResolvedValue(sanitizedUser);
			await expect(UserService.create(user)).resolves.toEqual(sanitizedUser);
			expect(redisSet).toHaveBeenCalled();
		});

		it("create user should throw error if password has less than 8 characters", async () => {
			await expect(UserService.create({ ...user, password: "error" })).rejects.toEqual(
				new ValidationError("password must be 8 characters min")
			);
		});
	});
});
