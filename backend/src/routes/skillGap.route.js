import { Router } from "express";

import {
    createSkillGap,
    getMySkillGaps,
    getSkillGapById
} from "../controllers/skillGap.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.post("/", createSkillGap);
router.get("/", getMySkillGaps);
router.get("/:id", getSkillGapById);

export default router;