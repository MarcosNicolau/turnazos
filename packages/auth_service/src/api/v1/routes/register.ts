import { validatePhoneOTPCode } from "api/middlewares/validatePhoneOTPCode";
import express from "express";
import { registerUser } from "api/v1/controllers/register";

export const router = express.Router();

router.post("/", validatePhoneOTPCode, registerUser);

export default router;
