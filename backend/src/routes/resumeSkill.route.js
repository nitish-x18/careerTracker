import { Router } from "express";

import {
    addResumeSkill,
    getMyResumeSkills,
    removeResumeSkill
} from "../controllers/resumeSkill.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.post("/:resumeId/skills", addResumeSkill);
router.get("/:resumeId/skills", getMyResumeSkills);
router.delete("/:resumeId/skills/:skillId", removeResumeSkill);

export default router;