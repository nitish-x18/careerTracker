import { Router } from "express";

import {
    createApplicationEvent,
    getApplicationEvents,
    deleteApplicationEvent
} from "../controllers/applicationEvent.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.post("/:applicationId/events", createApplicationEvent);
router.get("/:applicationId/events", getApplicationEvents);
router.delete("/:applicationId/events/:eventId", deleteApplicationEvent);

export default router;