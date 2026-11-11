
import { Router } from "express";

import {
    getResumeMatch
} from "../controllers/resumeMatch.controller.js";

import {
    authenticateUser
} from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.get(
    "/:resumeId/match/:jobId",
    getResumeMatch
);

export default router;
