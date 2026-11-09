
import { Router } from "express";
import { checkJobEligibility } from "../controllers/eligibility.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.get("/", checkJobEligibility);

export default router;
