import { Router } from "express";
import {
    registerUser,
    loginUser,
    getCurrentUser,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, registerUser);
router.post("/login", authRateLimiter, loginUser);
router.get("/me", authenticateUser, getCurrentUser);

export default router;