
import Task from "../models/task.model.js";
import Application from "../models/application.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { application_id, title, est_mins } = req.body;

        if (!title || !title.trim()) {
            throw new apiError(400, "Task title is required.");
        }

        if (
            est_mins === undefined ||
            !Number.isInteger(Number(est_mins)) ||
            Number(est_mins) <= 0
        ) {
            throw new apiError(400, "Estimated minutes must be a positive integer.");
        }

        if (application_id) {
            const application = await Application.findById(application_id);

            if (!application || application.user_id !== userId) {
                throw new apiError(404, "Application not found.");
            }
        }

        const id = crypto.randomUUID();

        await Task.create({
            id,
            user_id: userId,
            application_id: application_id || null,
            title: title.trim(),
            est_mins: Number(est_mins),
            done: 0
        });

        return res.status(201).json(
            new apiResponse(201, { taskId: id }, "Task created successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getMyTasks = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const tasks = await Task.getByUserId(userId);

        return res.status(200).json(
            new apiResponse(200, { tasks }, "Tasks retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { title, est_mins, done } = req.body;

        if (!id) {
            throw new apiError(400, "Task ID is required.");
        }

        if (!title || !title.trim()) {
            throw new apiError(400, "Task title is required.");
        }

        if (
            est_mins === undefined ||
            !Number.isInteger(Number(est_mins)) ||
            Number(est_mins) <= 0
        ) {
            throw new apiError(400, "Estimated minutes must be a positive integer.");
        }

        if (![0, 1, true, false].includes(done)) {
            throw new apiError(400, "Done must be true, false, 0, or 1.");
        }

        const result = await Task.update(id, userId, {
            title: title.trim(),
            est_mins: Number(est_mins),
            done: done ? 1 : 0
        });

        if (result.affectedRows === 0) {
            throw new apiError(404, "Task not found.");
        }

        return res.status(200).json(
            new apiResponse(200, {}, "Task updated successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        if (!id) {
            throw new apiError(400, "Task ID is required.");
        }

        const result = await Task.delete(id, userId);

        if (result.affectedRows === 0) {
            throw new apiError(404, "Task not found.");
        }

        return res.status(200).json(
            new apiResponse(200, {}, "Task deleted successfully.")
        );
    } catch (error) {
        next(error);
    }
};
