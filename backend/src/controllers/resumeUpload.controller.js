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

export const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF resume.",
            });
        }

        const resumeId = randomUUID();
        const cloudinaryResult = await uploadToCloudinary(
            req.file.buffer,
            resumeId
        );

        const fileUrl = cloudinaryResult.secure_url;

        await Resume.create({
            id: resumeId,
            user_id: req.user.userId,
            file_url: fileUrl,
            version: 1,
            ats_score: null,
        });

        return res.status(201).json({
            success: true,
            message: "Resume uploaded successfully.",
            data: {
                resume_id: resumeId,
                file_url: fileUrl,
                version: 1,
            },
        });
    } catch (error) {
        next(error);
    }
};