import UserPreference from "../models/userPrefrence.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const allowedCareerStages = ["student", "fresher", "experienced"];
const allowedCareerGoals = ["job", "internship", "higher_studies"];
const allowedWorkModes = ["remote", "hybrid", "onsite"];

export const getMyPreferences = async (req, res, next) => {
    try {
        const preferences = await UserPreference.findByUserId(req.user.userId);

        return res.status(200).json(
            new apiResponse(200, { preferences: preferences ?? null },
                "Preferences retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const saveMyPreferences = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const {
            career_stage,
            career_goal,
            education_level,
            academic_year,
            work_mode,
            preferred_location,
            skills,
            onboarding_completed,
        } = req.body;

        if (!allowedCareerStages.includes(career_stage)) {
            throw new apiError(400, "Invalid career stage.");
        }

        if (!allowedCareerGoals.includes(career_goal)) {
            throw new apiError(400, "Invalid career goal.");
        }

        if (!allowedWorkModes.includes(work_mode)) {
            throw new apiError(400, "Invalid work mode.");
        }

        if (skills !== undefined &&
            (!Array.isArray(skills) ||
             !skills.every(skill => typeof skill === "string"))) {
            throw new apiError(400, "Skills must be an array of strings.");
        }

        const existing = await UserPreference.findByUserId(user_id);

        const preferencesData = {
            career_stage,
            career_goal,
            education_level: education_level ?? null,
            academic_year: academic_year ?? null,
            work_mode,
            preferred_location: preferred_location ?? null,
            skills: skills ?? [],
            onboarding_completed: onboarding_completed ?? 1,
        };

        if (existing) {
            await UserPreference.update(user_id, preferencesData);
        } else {
            const { randomUUID } = await import("node:crypto");

            await UserPreference.create({
                id: randomUUID(),
                user_id,
                ...preferencesData,
            });
        }

        const preferences = await UserPreference.findByUserId(user_id);

        return res.status(200).json(
            new apiResponse(200, { preferences },
                "Preferences saved successfully.")
        );
    } catch (error) {
        next(error);
    }
};
