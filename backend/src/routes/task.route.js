import { Router } from "express";

import {
    createTask,
    getMyTasks,
    updateTask,
    deleteTask
} from "../controllers/task.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.post("/", createTask);
router.get("/", getMyTasks);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;