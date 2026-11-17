
import JobSkill from "../models/jobSkill.model.js";
import Job from "../models/job.model.js";
import Skill from "../models/skill.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const addJobSkill = async (req, res, next) => {
    try {
        const { job_id, skill_id, required = 1 } = req.body;

        if (!job_id || !skill_id) {
            throw new apiError(400, "Job ID and Skill ID are required.");
        }

        if (![0, 1, true, false].includes(required)) {
            throw new apiError(400, "Required must be 0 or 1.");
        }

        const job = await Job.findById(job_id);
        if (!job) {
            throw new apiError(404, "Job not found.");
        }

        const skill = await Skill.findById(skill_id);
        if (!skill) {
            throw new apiError(404, "Skill not found.");
        }

        await JobSkill.add({
            job_id,
            skill_id,
            required: required ? 1 : 0
        });

        return res.status(201).json(
            new apiResponse(201, {}, "Skill added to job successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getJobSkills = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        if (!jobId) {
            throw new apiError(400, "Job ID is required.");
        }

        const job = await Job.findById(jobId);

        if (!job) {
            throw new apiError(404, "Job not found.");
        }

        const skills = await JobSkill.getByJobId(jobId);

        return res.status(200).json(
            new apiResponse(200, { skills }, "Job skills retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const removeJobSkill = async (req, res, next) => {
    try {
        const { jobId, skillId } = req.params;

        if (!jobId || !skillId) {
            throw new apiError(400, "Job ID and Skill ID are required.");
        }

        const job = await Job.findById(jobId);
        if (!job) {
            throw new apiError(404, "Job not found.");
        }

        const skill = await Skill.findById(skillId);
        if (!skill) {
            throw new apiError(404, "Skill not found.");
        }

        const result = await JobSkill.remove(jobId, skillId);

        if (result.affectedRows === 0) {
            throw new apiError(404, "Job skill relationship not found.");
        }

        return res.status(200).json(
            new apiResponse(200, {}, "Skill removed from job successfully.")
        );
    } catch (error) {
        next(error);
    }
};
