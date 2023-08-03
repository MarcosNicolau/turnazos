import { InvalidCredentialsError, UnknownError } from "utils/error";
import { TokenPayload } from "type/token";
import { daysToSeconds } from "utils/date";
import { minutesToSeconds } from "../utils/date";
import jwt from "jsonwebtoken";
import fs from "fs";
import { RedisClientService } from "services/redis";
import Joi from "joi";
import { User } from "@prisma/client";
import { REDIS_KEYS } from "constants/redis";

export class TokenService {
	static issue = async (payload: TokenPayload) => {
		try {
			const cert = await fs.promises.readFile("./jwtRS256.key");
			const accessToken = jwt.sign(payload, cert, {
				algorithm: "RS256",
				issuer: "@turnazos/auth_service",
				expiresIn: minutesToSeconds(15),
			});
			const refreshToken = jwt.sign(payload, cert, {
				algorithm: "RS256",
				issuer: "@turnazos/auth_service",
				expiresIn: daysToSeconds(30),
			});
			//Save refresh token
			await RedisClientService.lists.pushFront(REDIS_KEYS.refresh_token(payload.user_id), [
				refreshToken,
			]);
			return { accessToken, refreshToken };
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};

	static verify = async (token: string) => {
		try {
			const cert = await fs.promises.readFile("./jwt.key.pub");
			let isValid = false;
			let payload: string | jwt.JwtPayload | undefined;
			jwt.verify(token, cert, (err, decoded) => {
				if (!err) isValid = true;
				payload = decoded;
			});
			return { isValid, payload };
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};

	static refreshToken = async (refreshToken: string) => {
		try {
			const { isValid, payload: decoded } = await this.verify(refreshToken);
			if (!isValid) return Promise.reject(new InvalidCredentialsError());
			const payload: TokenPayload = await Joi.object<TokenPayload>({
				name: Joi.string().required(),
				user_id: Joi.string().required(),
			})
				.unknown(true)
				.validateAsync(decoded);
			//Search refresh token in db and verify its not an old one
			const pos = await RedisClientService.lists.getElementPos(
				REDIS_KEYS.refresh_token(payload.user_id),
				refreshToken
			);
			//The refresh given is an old one, delete all refresh tokens
			if (pos !== 0) {
				await RedisClientService.deleteKey(REDIS_KEYS.refresh_token(payload.user_id));
				return Promise.reject(new InvalidCredentialsError());
			}
			//If its all good, then issue a new pair of tokens
			const tokens = await TokenService.issue({
				name: payload.name,
				user_id: payload.user_id,
			});
			return tokens;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	static deleteUserRefreshTokens = async (userId: User["id"]) => {
		try {
			await RedisClientService.deleteKey(REDIS_KEYS.refresh_token(userId));
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
}
