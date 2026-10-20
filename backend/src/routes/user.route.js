import { Router } from "express";
import {
    getMyAccount,
    updateMyAccount,
    deleteMyAccount,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.route("/")
    .get(getMyAccount)
    .patch(updateMyAccount)
    .delete(deleteMyAccount);

export default router;
