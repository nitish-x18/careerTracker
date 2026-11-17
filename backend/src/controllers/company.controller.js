
import Company from "../models/company.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createCompany = async (req, res, next) => {
    try {
        const { name, location } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            throw new apiError(400, "Company name is required.");
        }

        const id = crypto.randomUUID();

        await Company.create({
            id,
            name: name.trim(),
            location: location?.trim() || null
        });

        const company = await Company.findById(id);

        return res.status(201).json(
            new apiResponse(201, { company }, "Company created successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getAllCompanies = async (req, res, next) => {
    try {
        const companies = await Company.getAll();

        return res.status(200).json(
            new apiResponse(
                200,
                { companies },
                "Companies retrieved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new apiError(400, "Company ID is required.");
        }

        const company = await Company.findById(id);

        if (!company) {
            throw new apiError(404, "Company not found.");
        }

        return res.status(200).json(
            new apiResponse(200, { company }, "Company retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};
