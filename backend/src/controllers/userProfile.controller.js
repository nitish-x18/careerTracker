import UserProfile from "../models/userProfile.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const getMyProfile = async (req, res, next) => {
    try {
        const profile = await UserProfile.findByUserId(req.user.userId);

        return res.status(200).json(
            new apiResponse(200, { profile: profile ?? null },
                "Profile retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const createMyProfile = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { university, degree, major, cgpa, grad_year, work_auth } = req.body;

        const existingProfile = await UserProfile.findByUserId(user_id);

        if (existingProfile) {
            throw new apiError(409, "Profile already exists. Update it instead.");
        }

        if (cgpa !== undefined &&
            (cgpa === null || !Number.isFinite(Number(cgpa)) ||
             Number(cgpa) < 0 || Number(cgpa) > 10)) {
            throw new apiError(400, "CGPA must be between 0 and 10.");
        }

        const profileData = {
            user_id,
            university: university ?? null,
            degree: degree ?? null,
            major: major ?? null,
            cgpa: cgpa ?? null,
            grad_year: grad_year ?? null,
            work_auth: work_auth ?? null,
        };

        await UserProfile.create(profileData);

        const profile = await UserProfile.findByUserId(user_id);

        return res.status(201).json(
            new apiResponse(201, { profile }, "Profile created successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const existingProfile = await UserProfile.findByUserId(user_id);

        if (!existingProfile) {
            throw new apiError(404, "Profile not found. Create it first.");
        }

        const allowedFields = [
            "university", "degree", "major", "cgpa", "grad_year", "work_auth",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            throw new apiError(400, "Provide at least one profile field to update.");
        }

        if (updates.cgpa !== undefined &&
            (updates.cgpa === null || !Number.isFinite(Number(updates.cgpa)) ||
             Number(updates.cgpa) < 0 || Number(updates.cgpa) > 10)) {
            throw new apiError(400, "CGPA must be between 0 and 10.");
        }

        await UserProfile.update(user_id, updates);

        const profile = await UserProfile.findByUserId(user_id);

        return res.status(200).json(
            new apiResponse(200, { profile }, "Profile updated successfully.")
        );
    } catch (error) {
        next(error);
    }
};
