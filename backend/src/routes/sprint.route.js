
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

// Create sprint under a skill gap
router.post("/", createSprint);

// Get all sprints for a specific skill gap
router.get("/:skillGapId", getMySprints);

// Update sprint status
router.patch(
    "/:skillGapId/:sprintId/status",
    updateSprintStatus
);

// Delete sprint
router.delete(
    "/:skillGapId/:sprintId",
    deleteSprint
);

export default router;
