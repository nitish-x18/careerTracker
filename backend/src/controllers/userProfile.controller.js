
import UserProfile from "../models/userProfile.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

// Validate graduation year
const validateGradYear = (year) => {
    if (
        year === null ||
        year === undefined ||
        year === ""
    ) {
        return;
    }

    const numericYear = Number(year);

    if (
        !Number.isInteger(numericYear) ||
        numericYear < 1990 ||
        numericYear > 2100
    ) {
        throw new apiError(
            400,
            "Graduation year must be a valid year between 1990 and 2100."
        );
    }
};

// Validate CGPA
const validateCGPA = (cgpa) => {
    if (
        cgpa === null ||
        cgpa === undefined ||
        cgpa === ""
    ) {
        throw new apiError(400, "CGPA cannot be empty.");
    }

    const numericCGPA = Number(cgpa);

    if (
        !Number.isFinite(numericCGPA) ||
        numericCGPA < 0 ||
        numericCGPA > 10
    ) {
        throw new apiError(400, "CGPA must be between 0 and 10.");
    }
};

// GET MY PROFILE
export const getMyProfile = async (req, res, next) => {
    try {
        const profile = await UserProfile.findByUserId(
            req.user.userId
        );

        return res.status(200).json(
            new apiResponse(
                200,
                { profile: profile ?? null },
                "Profile retrieved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

// CREATE MY PROFILE
export const createMyProfile = async (req, res, next) => {
    try {
        const user_id = req.user.userId;

        const {
            university,
            degree,
            major,
            cgpa,
            grad_year,
            work_auth
        } = req.body;

        const existingProfile = await UserProfile.findByUserId(user_id);

        if (existingProfile) {
            throw new apiError(
                409,
                "Profile already exists. Update it instead."
            );
        }

        if (cgpa !== undefined) {
            validateCGPA(cgpa);
        }

        validateGradYear(grad_year);

        const profileData = {
            user_id,
            university: university ?? null,
            degree: degree ?? null,
            major: major ?? null,
            cgpa: cgpa ?? null,
            grad_year: grad_year === "" ? null : grad_year ?? null,
            work_auth: work_auth ?? null
        };

        await UserProfile.create(profileData);

        const profile = await UserProfile.findByUserId(user_id);

        return res.status(201).json(
            new apiResponse(
                201,
                { profile },
                "Profile created successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

// UPDATE MY PROFILE
export const updateMyProfile = async (req, res, next) => {
    try {
        const user_id = req.user.userId;

        const existingProfile = await UserProfile.findByUserId(user_id);

        if (!existingProfile) {
            throw new apiError(
                404,
                "Profile not found. Create it first."
            );
        }

        const allowedFields = [
            "university",
            "degree",
            "major",
            "cgpa",
            "grad_year",
            "work_auth"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            throw new apiError(
                400,
                "Provide at least one profile field to update."
            );
        }

        if (updates.cgpa !== undefined) {
            validateCGPA(updates.cgpa);
        }

        if (updates.grad_year !== undefined) {
            validateGradYear(updates.grad_year);

            if (updates.grad_year === "") {
                updates.grad_year = null;
            }
        }

        await UserProfile.update(user_id, updates);

        const profile = await UserProfile.findByUserId(user_id);

        return res.status(200).json(
            new apiResponse(
                200,
                { profile },
                "Profile updated successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};
