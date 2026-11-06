
import Resume from "../models/resume.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createResume = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { file_url, version, ats_score } = req.body;

        if (!file_url || typeof file_url !== "string" || !file_url.trim()) {
            throw new apiError(400, "Resume file URL is required.");
        }

        if (ats_score !== undefined &&
            (isNaN(ats_score) || ats_score < 0 || ats_score > 100)) {
            throw new apiError(400, "ATS score must be between 0 and 100.");
        }

        const id = crypto.randomUUID();

        await Resume.create({
            id,
            user_id: userId,
            file_url: file_url.trim(),
            version: version || null,
            ats_score: ats_score ?? null
        });

        const resume = await Resume.findById(id);

        return res.status(201).json(
            new apiResponse(201, { resume }, "Resume created successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getMyResumes = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const resumes = await Resume.getByUserId(userId);

        return res.status(200).json(
            new apiResponse(200, { resumes }, "Resumes retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getResumeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        if (!id) {
            throw new apiError(400, "Resume ID is required.");
        }

        const resume = await Resume.findById(id);

        if (!resume || resume.user_id !== userId) {
            throw new apiError(404, "Resume not found.");
        }

        return res.status(200).json(
            new apiResponse(200, { resume }, "Resume retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const updateResumeScore = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { ats_score } = req.body;

        if (ats_score === undefined ||
            isNaN(ats_score) ||
            ats_score < 0 ||
            ats_score > 100) {
            throw new apiError(400, "ATS score must be between 0 and 100.");
        }

        const resume = await Resume.findById(id);

        if (!resume || resume.user_id !== userId) {
            throw new apiError(404, "Resume not found.");
        }

        await Resume.updateScore(id, ats_score);

        const updatedResume = await Resume.findById(id);

        return res.status(200).json(
            new apiResponse(
                200,
                { resume: updatedResume },
                "Resume ATS score updated successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};
