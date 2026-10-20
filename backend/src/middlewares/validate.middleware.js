import { apiError } from "../utils/apiError.js";

export const validateRequiredFields = (fields) => {
    return (req, res, next) => {
        const missingFields = fields.filter((field) => {
            const value = req.body?.[field];

            return (
                value === undefined ||
                value === null ||
                (typeof value === "string" && value.trim() === "")
            );
        });

        if (missingFields.length > 0) {
            return next(
                new apiError(
                    400,
                    `Missing required fields: ${missingFields.join(", ")}`
                )
            );
        }

        next();
    };
};

export const validateEmail = (req, res, next) => {
    const { email } = req.body ?? {};

    if (typeof email !== "string") {
        return next(new apiError(400, "A valid email is required."));
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
        return next(new apiError(400, "Please provide a valid email."));
    }

    req.body.email = email.trim().toLowerCase();

    next();
};

export const validateStringLength = (field, min, max) => {
    return (req, res, next) => {
        const value = req.body?.[field];

        if (typeof value !== "string") {
            return next(
                new apiError(400, `${field} must be a string.`)
            );
        }

        const trimmedValue = value.trim();

        if (trimmedValue.length < min || trimmedValue.length > max) {
            return next(
                new apiError(
                    400,
                    `${field} must contain between ${min} and ${max} characters.`
                )
            );
        }

        req.body[field] = trimmedValue;

        next();
    };
};