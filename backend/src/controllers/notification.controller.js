
import Notification from "../models/notification.model.js";
import Application from "../models/application.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createNotification = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { application_id, type, due_at } = req.body;

        if (!type) {
            throw new apiError(400, "Notification type is required.");
        }

        if (application_id) {
            const application = await Application.findById(application_id);

            if (!application || application.user_id !== userId) {
                throw new apiError(404, "Application not found.");
            }
        }

        const id = crypto.randomUUID();

        await Notification.create({
            id,
            user_id: userId,
            application_id: application_id || null,
            type,
            due_at: due_at ?? null,
            is_read: 0
        });

        return res.status(201).json(
            new apiResponse(
                201,
                { notificationId: id },
                "Notification created successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getMyNotifications = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const notifications = await Notification.getByUserId(userId);

        return res.status(200).json(
            new apiResponse(
                200,
                { notifications },
                "Notifications retrieved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const markNotificationAsRead = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        if (!id) {
            throw new apiError(400, "Notification ID is required.");
        }

        const result = await Notification.markAsRead(id, userId);

        if (result.affectedRows === 0) {
            throw new apiError(404, "Notification not found.");
        }

        return res.status(200).json(
            new apiResponse(
                200,
                {},
                "Notification marked as read successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};
