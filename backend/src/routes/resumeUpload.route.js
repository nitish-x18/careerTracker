import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import resumeUpload from "../middlewares/resumeUpload.middleware.js";
import { uploadResume, fetchResumes } from "../controllers/resumeUpload.controller.js";

const router = express.Router();

router.post(
    "/upload",
    authenticateUser,
    resumeUpload.single("resume"),
    uploadResume
);

router.get(
    "/",
    authenticateUser,
    fetchResumes
);

export default router;