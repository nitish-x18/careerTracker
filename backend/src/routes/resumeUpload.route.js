import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import resumeUpload from "../middlewares/resumeUpload.middleware.js";
import { uploadResume } from "../controllers/resumeUpload.controller.js";

const router = express.Router();

router.post(
    "/upload",
    authenticateUser,
    resumeUpload.single("resume"),
    uploadResume
);

export default router;