import { Router } from "express";
import {
    getMyProfile,
    createMyProfile,
    updateMyProfile,
} from "../controllers/userProfile.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.route("/")
    .get(getMyProfile)
    .post(createMyProfile)
    .patch(updateMyProfile);

export default router;
