import { Router } from "express";
import {
    createApplication,
    getMyApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
} from "../controllers/application.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.route("/")
    .post(createApplication)
    .get(getMyApplications);

router.route("/:id")
    .get(getApplicationById)
    .patch(updateApplication)
    .delete(deleteApplication);

export default router;
