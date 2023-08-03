import { upload_auth } from "api/middlewares/upload_auth";
import { Router } from "express";
import { authorize } from "api/middlewares/authorize";
import { upload, get } from "api/v1/controllers";
import { ENV_VARS } from "config/env";

export const router = Router();

router.get("/private/:id", authorize, get(ENV_VARS.FILES_BASE_DIR_PRIVATE));
router.get("/:id", get(ENV_VARS.FILES_BASE_DIR_PUBLIC));
router.post("/", upload_auth, upload);

router.use("/storage", router);
