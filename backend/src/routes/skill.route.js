
import { Router } from "express";
import {
    createSkill,
    getAllSkills,
    getSkillById
} from "../controllers/skill.controller.js";

const router = Router();

router.post("/", createSkill);
router.get("/", getAllSkills);
router.get("/:id", getSkillById);

export default router;
