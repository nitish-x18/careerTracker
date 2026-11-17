import { Router } from "express";

import {
    createResume,
    getMyResumes,
    getResumeById,
    updateResumeScore
} from "../controllers/resume.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// All resume routes require authentication
router.use(authenticateUser);

router.post("/", createResume);
router.get("/", getMyResumes);
router.get("/:id", getResumeById);
router.patch("/:id/score", updateResumeScore);

export default router;