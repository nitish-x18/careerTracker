import { randomUUID } from "crypto";
import cloudinary from "../config/cloudinary.js";
import Resume from "../models/resume.model.js";

const uploadToCloudinary = (buffer, publicId) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                public_id: publicId,
                folder: "careertracker/resumes",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(buffer);
    });
};

// POST /api/resumes/upload
export const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF resume.",
            });
        }

        const userId = req.user.userId;
        const resumeId = randomUUID();
        const originalName = req.file.originalname;

        // Get the next resume version for the user
        const version = await Resume.getNextVersion(userId);

        // Upload the PDF to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(
            req.file.buffer,
            resumeId
        );

        const fileUrl = cloudinaryResult.secure_url;
        const storagePublicId = cloudinaryResult.public_id;

        // Save resume details in the database
        await Resume.create({
            id: resumeId,
            user_id: userId,
            file_url: fileUrl,
            original_name: originalName,
            storage_public_id: storagePublicId,
            version: version,
            ats_score: null,
        });

        // Retrieve the saved database record
        const savedResume = await Resume.findById(resumeId);

        return res.status(201).json({
            success: true,
            message: "Resume uploaded successfully.",
            data: {
                resume_id: savedResume.id,
                original_name: savedResume.original_name,
                file_url: savedResume.file_url,
                version: savedResume.version,
                created_at: savedResume.created_at,
                ats_score: savedResume.ats_score,
            },
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/resumes
export const fetchResumes = async (req, res, next) => {
    try {
        const resumes = await Resume.getByUserId(req.user.userId);

        return res.status(200).json({
            success: true,
            message: "Resumes fetched successfully.",
            data: resumes,
        });
    } catch (error) {
        next(error);
    }
};