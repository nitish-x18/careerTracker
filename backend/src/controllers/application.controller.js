import { randomUUID } from "node:crypto";

import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import Resume from "../models/resume.model.js";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const allowedStatuses = [
    "saved",
    "applied",
    "interview",
    "offer",
    "rejected",
    "withdrawn"
];

const allowedPriorities = ["low", "medium", "high"];

export const createApplication = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const {
            job_id = null,
            resume_id = null,
            status = "saved",
            priority_level = "medium",
            match_score = null,
            priority_score = null,
            applied_date = null,
            deadline = null,
            notes = null
        } = req.body;

        if (!allowedStatuses.includes(status)) {
            throw new apiError(400, "Invalid application status.");
        }

        if (!allowedPriorities.includes(priority_level)) {
            throw new apiError(400, "Invalid priority level.");
        }

        if (job_id) {
            const job = await Job.findById(job_id);

            if (!job) {
                throw new apiError(404, "Job not found.");
            }
        }

        if (resume_id) {
            const resume = await Resume.findById(resume_id);

            if (!resume || resume.user_id !== userId) {
                throw new apiError(
                    404,
                    "Resume not found for this user."
                );
            }
        }

        const application = {
            id: randomUUID(),
            user_id: userId,
            job_id,
            resume_id,
            status,
            priority_level,
            match_score,
            priority_score,
            applied_date,
            deadline,
            notes
        };

        await Application.create(application);

        return res.status(201).json(
            new apiResponse(
                201,
                { application },
                "Application created successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.getByUserId(
            req.user.userId
        );

        return res.status(200).json(
            new apiResponse(
                200,
                { applications },
                "Applications retrieved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findById(
            req.params.id,
            req.user.userId
        );

        if (!application) {
            throw new apiError(404, "Application not found.");
        }

        return res.status(200).json(
            new apiResponse(
                200,
                { application },
                "Application retrieved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const updateApplication = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const existingApplication = await Application.findById(
            id,
            userId
        );

        if (!existingApplication) {
            throw new apiError(404, "Application not found.");
        }

        const {
            status,
            priority_level,
            notes,
            priority_score,
            match_score
        } = req.body;

        if (
            status !== undefined &&
            !allowedStatuses.includes(status)
        ) {
            throw new apiError(400, "Invalid application status.");
        }

        if (
            priority_level !== undefined &&
            !allowedPriorities.includes(priority_level)
        ) {
            throw new apiError(400, "Invalid priority level.");
        }

        const updatedData = {
            status: status ?? existingApplication.status,
            priority_level:
                priority_level ?? existingApplication.priority_level,
            notes: notes ?? existingApplication.notes,
            priority_score:
                priority_score ?? existingApplication.priority_score,
            match_score:
                match_score ?? existingApplication.match_score
        };

        await Application.update(id, userId, updatedData);

        const updatedApplication = await Application.findById(
            id,
            userId
        );

        return res.status(200).json(
            new apiResponse(
                200,
                { application: updatedApplication },
                "Application updated successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const deleteApplication = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const existingApplication = await Application.findById(
            id,
            userId
        );

        if (!existingApplication) {
            throw new apiError(404, "Application not found.");
        }

        await Application.delete(id, userId);

        return res.status(200).json(
            new apiResponse(
                200,
                null,
                "Application deleted successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};