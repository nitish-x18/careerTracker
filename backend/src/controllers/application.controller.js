
import { randomUUID } from "node:crypto";

import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import Resume from "../models/resume.model.js";
import JobSkill from "../models/jobSkill.model.js";
import ResumeSkill from "../models/resumeSkill.model.js";
import UserProfile from "../models/userProfile.model.js";

import { classifyApplicationRisk } from "../logic/applicationRisk.js";
import { compareSkills } from "../logic/skillMatching.js";
import { calculatePriorityScore } from "../logic/priorityScoring.js";
import { PriorityQueue } from "../logic/priorityQueue.js";
import { checkEligibility } from "../logic/eligibilityCheck.js";

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
const activeStatuses = ["saved", "applied", "interview"];

function getDaysRemaining(deadline) {
    if (!deadline) return null;

    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
        return null;
    }

    const today = new Date();

    const todayUTC = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
    );

    const deadlineUTC = Date.UTC(
        deadlineDate.getUTCFullYear(),
        deadlineDate.getUTCMonth(),
        deadlineDate.getUTCDate()
    );

    return Math.round(
        (deadlineUTC - todayUTC) / (24 * 60 * 60 * 1000)
    );
}

function getEffectiveDeadline(application, jobDeadline = null) {
    return application.deadline || jobDeadline || null;
}

function validateOptionalDate(value, fieldName) {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        throw new apiError(
            400,
            `${fieldName} must be in YYYY-MM-DD format.`
        );
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== value
    ) {
        throw new apiError(400, `Invalid ${fieldName}.`);
    }

    return value;
}

async function calculateApplicationMetrics({
    userId,
    job,
    resume,
    status,
    deadline
}) {
    let matchScore = null;
    let priorityScore = null;
    let skillResult = null;
    let eligibility = null;

    if (!job || !resume) {
        return {
            matchScore,
            priorityScore,
            skillResult,
            eligibility
        };
    }

    if (String(resume.user_id) !== String(userId)) {
        throw new apiError(404, "Resume not found for this user.");
    }

    const jobSkills = await JobSkill.getByJobId(job.id);
    const resumeSkills = await ResumeSkill.getByResumeId(resume.id);

    skillResult = compareSkills(resumeSkills, jobSkills);
    matchScore = skillResult.matchPercentage;

    const effectiveDeadline = getEffectiveDeadline(
        { deadline },
        job.deadline
    );

    const daysRemaining = getDaysRemaining(effectiveDeadline);

    if (activeStatuses.includes(status) && daysRemaining !== null) {
        priorityScore = calculatePriorityScore({
            daysRemaining,
            matchedSkills: skillResult.matchedCount,
            requiredSkills: skillResult.totalRequiredSkills,
            status
        });
    }

    const profile = await UserProfile.findByUserId(userId);

    if (profile) {
        eligibility = checkEligibility(profile, job);
    }

    return {
        matchScore,
        priorityScore,
        skillResult,
        eligibility
    };
}

// CREATE APPLICATION
export const createApplication = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const {
            job_id = null,
            resume_id = null,
            status = "saved",
            priority_level = "medium",
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

        const validAppliedDate = validateOptionalDate(
            applied_date,
            "Applied date"
        );

        const validDeadline = validateOptionalDate(
            deadline,
            "Deadline"
        );

        let job = null;
        let resume = null;

        if (job_id) {
            job = await Job.findById(job_id);

            if (!job) {
                throw new apiError(404, "Job not found.");
            }
        }

        if (resume_id) {
            resume = await Resume.findById(resume_id);

            if (!resume || String(resume.user_id) !== String(userId)) {
                throw new apiError(404, "Resume not found for this user.");
            }
        }

        const metrics = await calculateApplicationMetrics({
            userId,
            job,
            resume,
            status,
            deadline: validDeadline
        });

        const application = {
            id: randomUUID(),
            user_id: userId,
            job_id,
            resume_id,
            status,
            priority_level,
            match_score: metrics.matchScore,
            priority_score: metrics.priorityScore,
            applied_date: validAppliedDate,
            deadline: validDeadline,
            notes
        };

        await Application.create(application);

        return res.status(201).json(
            new apiResponse(
                201,
                {
                    application,
                    skillMatch: metrics.skillResult,
                    eligibility: metrics.eligibility
                },
                "Application created successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

// GET MY APPLICATIONS
export const getMyApplications = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const applications = await Application.getByUserId(userId);

        const queue = new PriorityQueue();

        for (const application of applications) {
            let priorityScore = 0;
            let matchScore = application.match_score ?? null;

            if (
                activeStatuses.includes(application.status) &&
                application.job_id &&
                application.resume_id
            ) {
                const job = await Job.findById(application.job_id);

                const resume = await Resume.findById(
                    application.resume_id
                );

                if (job && resume) {
                    const metrics = await calculateApplicationMetrics({
                        userId,
                        job,
                        resume,
                        status: application.status,
                        deadline: application.deadline
                    });

                    priorityScore = metrics.priorityScore ?? 0;
                    matchScore = metrics.matchScore;
                }
            }

            queue.push({
                ...application,
                priority_score: priorityScore,
                match_score: matchScore,
                applicationId: String(application.id),
                priorityScore: Number(priorityScore),
                deadline:
                    application.deadline ||
                    application.job_deadline ||
                    null
            });
        }

        const rankedApplications = [];

        while (!queue.isEmpty()) {
            const ranked = queue.pop();

            const {
                applicationId,
                priorityScore,
                ...application
            } = ranked;

            const risk = classifyApplicationRisk(application);

            rankedApplications.push({
                ...application,
                ...risk
            });
        }

        return res.status(200).json(
            new apiResponse(
                200,
                { applications: rankedApplications },
                "Applications retrieved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

// GET APPLICATION BY ID
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

// UPDATE APPLICATION
export const updateApplication = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const existingApplication = await Application.findById(id, userId);

        if (!existingApplication) {
            throw new apiError(404, "Application not found.");
        }

        const {
            status,
            priority_level,
            notes,
            deadline,
            applied_date
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

        const nextStatus = status ?? existingApplication.status;

        const nextDeadline =
            deadline === undefined
                ? existingApplication.deadline
                : validateOptionalDate(deadline, "Deadline");

        const nextAppliedDate =
            applied_date === undefined
                ? existingApplication.applied_date
                : validateOptionalDate(applied_date, "Applied date");

        const statusChanged =
            nextStatus !== existingApplication.status;

        const deadlineChanged =
            nextDeadline !== existingApplication.deadline;

        let priorityScore = existingApplication.priority_score;
        let matchScore = existingApplication.match_score;

        if (!activeStatuses.includes(nextStatus)) {
            priorityScore = null;
        } else if (
            (statusChanged || deadlineChanged) &&
            existingApplication.job_id &&
            existingApplication.resume_id
        ) {
            const job = await Job.findById(existingApplication.job_id);

            const resume = await Resume.findById(
                existingApplication.resume_id
            );

            if (job && resume) {
                const metrics = await calculateApplicationMetrics({
                    userId,
                    job,
                    resume,
                    status: nextStatus,
                    deadline: nextDeadline
                });

                priorityScore = metrics.priorityScore;
                matchScore = metrics.matchScore;
            }
        }

        const updatedData = {
            status: nextStatus,
            priority_level:
                priority_level ?? existingApplication.priority_level,
            notes:
                notes === undefined
                    ? existingApplication.notes
                    : notes,
            priority_score: priorityScore,
            match_score: matchScore,
            applied_date: nextAppliedDate,
            deadline: nextDeadline
        };

        await Application.update(id, userId, updatedData);

        const updatedApplication = await Application.findById(id, userId);

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

// DELETE APPLICATION
export const deleteApplication = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const existingApplication = await Application.findById(id, userId);

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
