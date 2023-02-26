import { upload_auth } from "api/middlewares/upload_auth";
import { Router } from "express";
import { authorize } from "api/middlewares/authorize";
import { getPublic, upload, getPrivate } from "api/v1/controllers";

export const router = Router();

router.get("/private/:id", authorize, getPrivate);
router.get("/:id", getPublic);
router.post("/", upload_auth, upload);

router.use("/storage", router);
