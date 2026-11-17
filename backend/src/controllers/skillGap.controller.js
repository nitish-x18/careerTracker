
import SkillGap from "../models/skillGap.model.js";
import Skill from "../models/skill.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createSkillGap = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const {
            skill_id,
            urgency,
            ats_boost,
            frequency_pct
        } = req.body;

        if (!skill_id) {
            throw new apiError(400, "Skill ID is required.");
        }

        if (!["low", "medium", "high"].includes(urgency)) {
            throw new apiError(400, "Urgency must be low, medium, or high.");
        }

        if (
            ats_boost !== undefined &&
            (!Number.isInteger(Number(ats_boost)) || ats_boost < 0)
        ) {
            throw new apiError(400, "ATS boost must be a non-negative integer.");
        }

        if (
            frequency_pct !== undefined &&
            (isNaN(frequency_pct) || frequency_pct < 0 || frequency_pct > 100)
        ) {
            throw new apiError(400, "Frequency percentage must be between 0 and 100.");
        }

        const skill = await Skill.findById(skill_id);

        if (!skill) {
            throw new apiError(404, "Skill not found.");
        }

        const id = crypto.randomUUID();

        await SkillGap.create({
            id,
            user_id: userId,
            skill_id,
            urgency,
            ats_boost: ats_boost ?? null,
            frequency_pct: frequency_pct ?? null
        });

        const skillGap = await SkillGap.findById(id, userId);

        return res.status(201).json(
            new apiResponse(201, { skillGap }, "Skill gap created successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getMySkillGaps = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const skillGaps = await SkillGap.getByUserId(userId);

        return res.status(200).json(
            new apiResponse(
                200,
                { skillGaps },
                "Skill gaps retrieved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getSkillGapById = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        if (!id) {
            throw new apiError(400, "Skill Gap ID is required.");
        }

        const skillGap = await SkillGap.findById(id, userId);

        if (!skillGap) {
            throw new apiError(404, "Skill gap not found.");
        }

        return res.status(200).json(
            new apiResponse(200, { skillGap }, "Skill gap retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};
