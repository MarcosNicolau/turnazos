import { authenticate } from "api/middlewares";
import { generateOTPCode, generateOTPCodeWithPhone } from "../controllers/otpCode";
import express from "express";

export const router = express.Router();

router.get("/generate", authenticate, generateOTPCode);
router.post("/generate/phone", generateOTPCodeWithPhone);
