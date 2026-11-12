
import Resume from "../models/resume.model.js";
import Job from "../models/job.model.js";
import ResumeSkill from "../models/resumeSkill.model.js";
import JobSkill from "../models/jobSkill.model.js";

import { compareSkills } from "../logic/skillMatching.js";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const getResumeMatch = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { resumeId, jobId } = req.params;

        // Validate required IDs
        if (!resumeId || !jobId) {
            throw new apiError(
                400,
                "Resume ID and Job ID are required."
            );
        }

        // Validate UUID format
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (
            !uuidRegex.test(String(resumeId)) ||
            !uuidRegex.test(String(jobId))
        ) {
            throw new apiError(
                400,
                "Resume ID and Job ID must be valid UUIDs."
            );
        }

        // Verify resume exists and belongs to logged-in user
        const resume = await Resume.findById(resumeId);

        if (
            !resume ||
            String(resume.user_id) !== String(userId)
        ) {
            throw new apiError(
                404,
                "Resume not found for this user."
            );
        }

        // Verify job exists
        const job = await Job.findById(jobId);

        if (!job) {
            throw new apiError(404, "Job not found.");
        }

        // Fetch resume and job skills
        const resumeSkills =
            await ResumeSkill.getByResumeId(resumeId);

        const jobSkills =
            await JobSkill.getByJobId(jobId);

        // Reuse existing skill matching logic
        const matchResult = compareSkills(
            resumeSkills,
            jobSkills
        );

        return res.status(200).json(
            new apiResponse(
                200,
                {
                    resume_id: resumeId,
                    job_id: jobId,
                    matchedSkills: matchResult.matchedSkills,
                    missingSkills: matchResult.missingSkills,
                    matchedCount: matchResult.matchedCount,
                    missingCount: matchResult.missingCount,
                    totalRequiredSkills:
                        matchResult.totalRequiredSkills,
                    matchPercentage:
                        matchResult.matchPercentage
                },
                "Resume match calculated successfully."
            )
        );

    } catch (error) {
        next(error);
    }
};
