
import { Router } from "express";

import {
    createCompany,
    getAllCompanies,
    getCompanyById
} from "../controllers/company.controller.js";

const router = Router();

// Create a company
router.post("/", createCompany);

// Get all companies
router.get("/", getAllCompanies);

// Get company by ID
router.get("/:id", getCompanyById);

export default router;
