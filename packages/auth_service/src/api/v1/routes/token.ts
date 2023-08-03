import { refreshToken } from "api/v1/controllers/token";
import express from "express";

export const router = express.Router();

router.post("/refresh", refreshToken);
