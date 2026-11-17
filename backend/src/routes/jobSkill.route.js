
import { Router } from "express";
import {
    addJobSkill,
    getJobSkills,
    removeJobSkill
} from "../controllers/jobSkill.controller.js";

const router = Router();

router.post("/:jobId/skills", addJobSkill);
router.get("/:jobId/skills", getJobSkills);
router.delete("/:jobId/skills/:skillId", removeJobSkill);

export default router;

