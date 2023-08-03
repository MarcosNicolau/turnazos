import { authenticate, validateOTPCode, validatePhoneOTPCode } from "api/middlewares";
import { changePassword, forgotPassword } from "../controllers/password";
import express from "express";

export const router = express.Router();

router.put("/", authenticate, validateOTPCode, changePassword);
router.put("/forgot", validatePhoneOTPCode, forgotPassword);
