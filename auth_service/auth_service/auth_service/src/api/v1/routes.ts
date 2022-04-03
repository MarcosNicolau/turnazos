import { readJWT, read2FA } from "api/middlewares";
import {
	createUser,
	getUser,
	getUserWithCredentials,
	changePassword,
	forgotPassword,
	updateUser,
	deleteUser,
} from "./controllers";
import express from "express";

const router = express.Router();

router.get("/", readJWT, getUser);
router.post("/credentials", getUserWithCredentials);
router.post("/", createUser);
router.put("/", readJWT, updateUser);
router.delete("/", read2FA, deleteUser);
router.put("/password", readJWT, changePassword);
router.put("/password/forgot", read2FA, forgotPassword);

export default router;
