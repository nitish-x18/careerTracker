import { Router } from "express";
import {
    getMyPreferences,
    saveMyPreferences,
} from "../controllers/userPreference.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.route("/")
    .get(getMyPreferences)
    .put(saveMyPreferences);

export default router;