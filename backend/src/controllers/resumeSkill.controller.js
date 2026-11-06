
import Resume from "../models/resume.model.js";
import ResumeSkill from "../models/resumeSkill.model.js";
import Skill from "../models/skill.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const addResumeSkill = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { resume_id, skill_id, verified } = req.body;

        if (!resume_id || !skill_id) {
            throw new apiError(400, "Resume ID and Skill ID are required.");
        }

        if (verified !== undefined && ![0, 1, false, true].includes(verified)) {
            throw new apiError(400, "Verified must be true or false.");
        }

        const resume = await Resume.findById(resume_id);

        if (!resume || resume.user_id !== userId) {
            throw new apiError(404, "Resume not found.");
        }

        const skill = await Skill.findById(skill_id);

        if (!skill) {
            throw new apiError(404, "Skill not found.");
        }

        const existingSkills = await ResumeSkill.getByResumeId(resume_id);

        if (existingSkills.some(item => item.skill_id === skill_id)) {
            throw new apiError(409, "Skill is already associated with this resume.");
        }

        await ResumeSkill.add({
            resume_id,
            skill_id,
            verified: verified ? 1 : 0
        });

        const skills = await ResumeSkill.getByResumeId(resume_id);

        return res.status(201).json(
            new apiResponse(201, { skills }, "Resume skill added successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getMyResumeSkills = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { resumeId } = req.params;

        if (!resumeId) {
            throw new apiError(400, "Resume ID is required.");
        }

        const resume = await Resume.findById(resumeId);

        if (!resume || resume.user_id !== userId) {
            throw new apiError(404, "Resume not found.");
        }

        const skills = await ResumeSkill.getByResumeId(resumeId);

        return res.status(200).json(
            new apiResponse(200, { skills }, "Resume skills retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const removeResumeSkill = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { resumeId, skillId } = req.params;

        if (!resumeId || !skillId) {
            throw new apiError(400, "Resume ID and Skill ID are required.");
        }

        const resume = await Resume.findById(resumeId);

        if (!resume || resume.user_id !== userId) {
            throw new apiError(404, "Resume not found.");
        }

        const skills = await ResumeSkill.getByResumeId(resumeId);

        if (!skills.some(item => item.skill_id === skillId)) {
            throw new apiError(404, "Skill is not associated with this resume.");
        }

        await ResumeSkill.remove(resumeId, skillId);

        return res.status(200).json(
            new apiResponse(200, null, "Resume skill removed successfully.")
        );
    } catch (error) {
        next(error);
    }
};
