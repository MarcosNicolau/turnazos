import { authenticate } from "api/middlewares";
import { login, loginConfirm, logout } from "api/v1/controllers/login";
import express from "express";

export const router = express.Router();

router.post("/", login);
router.post("/confirm", loginConfirm);
router.get("/logout", authenticate, logout);
