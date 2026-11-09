
import ApplicationEvent from "../models/applicationEvent.model.js";
import Application from "../models/application.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createApplicationEvent = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { application_id, event_type, scheduled_at, details } = req.body;

        if (!application_id || !event_type) {
            throw new apiError(400, "Application ID and event type are required.");
        }

        const application = await Application.findById(application_id);

        if (!application || application.user_id !== userId) {
            throw new apiError(404, "Application not found.");
        }

        const id = crypto.randomUUID();

        await ApplicationEvent.create({
            id,
            application_id,
            event_type,
            scheduled_at: scheduled_at ?? null,
            details: details ?? null
        });

        return res.status(201).json(
            new apiResponse(201, { eventId: id }, "Application event created successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getApplicationEvents = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { applicationId } = req.params;

        if (!applicationId) {
            throw new apiError(400, "Application ID is required.");
        }

        const application = await Application.findById(applicationId);

        if (!application || application.user_id !== userId) {
            throw new apiError(404, "Application not found.");
        }

        const events = await ApplicationEvent.getByApplicationId(applicationId);

        return res.status(200).json(
            new apiResponse(200, { events }, "Application events retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const deleteApplicationEvent = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { applicationId, eventId } = req.params;

        const application = await Application.findById(applicationId);

        if (!application || application.user_id !== userId) {
            throw new apiError(404, "Application not found.");
        }

        const events = await ApplicationEvent.getByApplicationId(applicationId);
        const eventExists = events.some(event => event.id === eventId);

        if (!eventExists) {
            throw new apiError(404, "Application event not found.");
        }

        await ApplicationEvent.delete(eventId);

        return res.status(200).json(
            new apiResponse(200, {}, "Application event deleted successfully.")
        );
    } catch (error) {
        next(error);
    }
};
