import { Router } from "express";

import {
    createSavedSearch,
    getMySavedSearches,
    deleteSavedSearch
} from "../controllers/savedSearch.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.post("/", createSavedSearch);
router.get("/", getMySavedSearches);
router.delete("/:id", deleteSavedSearch);

export default router;