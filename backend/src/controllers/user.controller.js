import User from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const getMyAccount = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            throw new apiError(404, "User not found.");
        }

        return res.status(200).json(
            new apiResponse(200, { user }, "Account retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const updateMyAccount = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { name, email } = req.body;

        if (name === undefined && email === undefined) {
            throw new apiError(400, "Provide a name or email to update.");
        }

        if (name !== undefined &&
            (typeof name !== "string" || !name.trim())) {
            throw new apiError(400, "Name must be a non-empty string.");
        }

        if (email !== undefined &&
            (typeof email !== "string" ||
             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
            throw new apiError(400, "Enter a valid email address.");
        }

        const currentUser = await User.findById(userId);

        if (!currentUser) {
            throw new apiError(404, "User not found.");
        }

        const updatedData = {
            name: name === undefined ? currentUser.name : name.trim(),
            email: email === undefined
                ? currentUser.email
                : email.trim().toLowerCase(),
        };

        if (updatedData.email !== currentUser.email) {
            const existingUser = await User.findByEmail(updatedData.email);

            if (existingUser) {
                throw new apiError(409, "Email is already registered.");
            }
        }

        await User.update(userId, updatedData);

        const updatedUser = await User.findById(userId);

        return res.status(200).json(
            new apiResponse(200, { user: updatedUser }, "Account updated successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const deleteMyAccount = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user) {
            throw new apiError(404, "User not found.");
        }

        await User.delete(userId);

        return res.status(200).json(
            new apiResponse(200, null, "Account deleted successfully.")
        );
    } catch (error) {
        next(error);
    }
};
