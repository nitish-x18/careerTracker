
import Job from "../models/job.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createJob = async (req, res, next) => {
    try {
        const {
            company_id,
            title,
            type,
            season,
            location,
            pay,
            deadline,
            min_cgpa,
            work_auth_req,
            source_url,
            required_degree,
            required_major,
            min_grad_year,
            max_grad_year
        } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            throw new apiError(400, "Job title is required.");
        }

        if (min_cgpa !== undefined &&
            (isNaN(min_cgpa) || min_cgpa < 0 || min_cgpa > 10)) {
            throw new apiError(400, "CGPA must be between 0 and 10.");
        }

        if (min_grad_year != null && max_grad_year != null &&
            Number(min_grad_year) > Number(max_grad_year)) {
            throw new apiError(400, "Minimum graduation year cannot exceed maximum graduation year.");
        }

        const id = crypto.randomUUID();

        await Job.create({
            id,
            company_id: company_id || null,
            title: title.trim(),
            type: type || null,
            season: season || null,
            location: location || null,
            pay: pay || null,
            deadline: deadline || null,
            min_cgpa: min_cgpa ?? null,
            work_auth_req: work_auth_req || null,
            source_url: source_url || null,
            required_degree: required_degree || null,
            required_major: required_major || null,
            min_grad_year: min_grad_year ?? null,
            max_grad_year: max_grad_year ?? null
        });

        const job = await Job.findById(id);

        return res.status(201).json(
            new apiResponse(201, { job }, "Job created successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.getAll();

        return res.status(200).json(
            new apiResponse(200, { jobs }, "Jobs retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new apiError(400, "Job ID is required.");
        }

        const job = await Job.findById(id);

        if (!job) {
            throw new apiError(404, "Job not found.");
        }

        return res.status(200).json(
            new apiResponse(200, { job }, "Job retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};
