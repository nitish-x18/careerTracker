
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
        return { matchScore, priorityScore, skillResult, eligibility };
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

    return { matchScore, priorityScore, skillResult, eligibility };
}

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
            deadline
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
            applied_date,
            deadline,
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

export const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.getByUserId(
            req.user.userId
        );

        const queue = new PriorityQueue();

        for (const application of applications) {
            const storedScore =
                application.priority_score == null
                    ? 0
                    : Number(application.priority_score);

            if (!Number.isFinite(storedScore)) {
                throw new Error(
                    `Invalid priority score for application ${application.id}`
                );
            }

            queue.push({
                ...application,
                applicationId: String(application.id),
                priorityScore: storedScore,
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

        const { status, priority_level, notes } = req.body;

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

        let priorityScore = existingApplication.priority_score;
        let matchScore = existingApplication.match_score;

        const statusChanged =
            status !== undefined &&
            status !== existingApplication.status;

        if (
            statusChanged &&
            activeStatuses.includes(nextStatus) &&
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
                    deadline: existingApplication.deadline
                });

                priorityScore = metrics.priorityScore ?? priorityScore;
                matchScore = metrics.matchScore ?? matchScore;
            }
        } else if (
            statusChanged &&
            !activeStatuses.includes(nextStatus)
        ) {
            // Closed applications no longer need an active ranking score.
            priorityScore = null;
        }

        const updatedData = {
            status: nextStatus,
            priority_level:
                priority_level ?? existingApplication.priority_level,
            notes: notes ?? existingApplication.notes,
            priority_score: priorityScore,
            match_score: matchScore
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
