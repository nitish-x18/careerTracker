import { Router } from "express";

import {
    createSprint,
    getMySprints,
    updateSprintStatus,
    deleteSprint
} from "../controllers/sprint.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.post("/", createSprint);
router.get("/", getMySprints);
router.patch("/:id/status", updateSprintStatus);
router.delete("/:id", deleteSprint);

export default router;