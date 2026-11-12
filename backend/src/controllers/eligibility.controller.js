
import Job from "../models/job.model.js";
import Resume from "../models/resume.model.js";
import UserProfile from "../models/userProfile.model.js";
import JobSkill from "../models/jobSkill.model.js";
import ResumeSkill from "../models/resumeSkill.model.js";

import { checkEligibility } from "../logic/eligibilityCheck.js";
import { compareSkills } from "../logic/skillMatching.js";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const checkJobEligibility = async (req, res, next) => {
    try {
        // Get authenticated user ID from JWT
        const userId = req.user.userId;

        // Get IDs from query parameters
        const { job_id, resume_id } = req.query;

        // Validate required parameters
        if (!job_id || !resume_id) {
            throw new apiError(
                400,
                "Both job_id and resume_id are required."
            );
        }

        // Validate UUID format
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (
            !uuidRegex.test(String(job_id)) ||
            !uuidRegex.test(String(resume_id))
        ) {
            throw new apiError(
                400,
                "job_id and resume_id must be valid UUIDs."
            );
        }

        // Find job
        const job = await Job.findById(job_id);

        if (!job) {
            throw new apiError(404, "Job not found.");
        }

        // Find resume
        const resume = await Resume.findById(resume_id);

        // Verify resume belongs to authenticated user
        if (
            !resume ||
            String(resume.user_id) !== String(userId)
        ) {
            throw new apiError(
                404,
                "Resume not found for this user."
            );
        }

        // Fetch authenticated user's student profile
        const profile = await UserProfile.findByUserId(userId);

        if (!profile) {
            throw new apiError(
                404,
                "Student profile not found. Please complete your profile."
            );
        }

        // Fetch job and resume skills
        const jobSkills = await JobSkill.getByJobId(job_id);
        const resumeSkills = await ResumeSkill.getByResumeId(resume_id);

        // Check academic eligibility
        const eligibilityResult = checkEligibility(profile, job);

        // Compare student skills with job requirements
        const skillResult = compareSkills(
            resumeSkills,
            jobSkills
        );

        // Return eligibility response
        return res.status(200).json(
            new apiResponse(
                200,
                {
                    job_id: job.id,
                    resume_id: resume.id,

                    eligibility: {
                        status: eligibilityResult.status,
                        eligible: eligibilityResult.eligible,
                        reasons: eligibilityResult.reasons,
                        unverified_fields: eligibilityResult.unverified
                    },

                    skills: {
                        matched_skills: skillResult.matchedSkills,
                        missing_skills: skillResult.missingSkills,
                        matched_count: skillResult.matchedCount,
                        missing_count: skillResult.missingCount,
                        total_required_skills:
                            skillResult.totalRequiredSkills,
                        match_percentage:
                            skillResult.matchPercentage
                    }
                },
                "Eligibility checked successfully."
            )
        );

    } catch (error) {
        next(error);
    }
};
