import { Router } from "express";

import {
    createNotification,
    getMyNotifications,
    markNotificationAsRead
} from "../controllers/notification.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.post("/", createNotification);
router.get("/", getMyNotifications);
router.patch("/:id/read", markNotificationAsRead);

export default router;