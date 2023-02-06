import { Router } from "express";

import { router as loginRoutes } from "./login";
import { router as otpCodeRoutes } from "./otp_code";
import { router as passwordRoutes } from "./password";
import { router as registerRoutes } from "./register";
import { router as tokenRoutes } from "./token";

export const router = Router();

router.use("/login", loginRoutes);
router.use("/register", registerRoutes);
router.use("/password", passwordRoutes);
router.use("/token", tokenRoutes);
router.use("/otp_code", otpCodeRoutes);
