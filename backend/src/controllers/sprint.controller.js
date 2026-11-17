
import crypto from "node:crypto";

import Sprint from "../models/sprint.model.js";
import SkillGap from "../models/skillGap.model.js";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validateUUID = (id, fieldName) => {
    if (!id || !uuidRegex.test(String(id))) {
        throw new apiError(
            400,
            `${fieldName} must be a valid UUID.`
        );
    }
};

// Create a new sprint
export const createSprint = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { skill_gap_id, title, est_hours } = req.body;

        validateUUID(skill_gap_id, "Skill gap ID");

        if (typeof title !== "string" || !title.trim()) {
            throw new apiError(400, "Sprint title is required.");
        }

        if (
            est_hours === undefined ||
            !Number.isFinite(Number(est_hours)) ||
            Number(est_hours) <= 0
        ) {
            throw new apiError(
                400,
                "Estimated hours must be a positive number."
            );
        }

        const skillGap = await SkillGap.findById(
            skill_gap_id,
            userId
        );

        if (!skillGap) {
            throw new apiError(404, "Skill gap not found.");
        }

        const id = crypto.randomUUID();

        await Sprint.create({
            id,
            skill_gap_id,
            title: title.trim(),
            est_hours: Number(est_hours),
            status: "planned"
        });

        return res.status(201).json(
            new apiResponse(
                201,
                { sprintId: id },
                "Sprint created successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

// Get all sprints belonging to a skill gap
export const getMySprints = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { skillGapId } = req.params;

        validateUUID(skillGapId, "Skill gap ID");

        const skillGap = await SkillGap.findById(
            skillGapId,
            userId
        );

        if (!skillGap) {
            throw new apiError(404, "Skill gap not found.");
        }

        const sprints = await Sprint.getBySkillGapId(skillGapId);

        return res.status(200).json(
            new apiResponse(
                200,
                { sprints },
                "Sprints retrieved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

// Update sprint status
export const updateSprintStatus = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { skillGapId, sprintId } = req.params;
        const { status } = req.body;

        validateUUID(skillGapId, "Skill gap ID");
        validateUUID(sprintId, "Sprint ID");

        const allowedStatuses = [
            "planned",
            "in_progress",
            "completed"
        ];

        if (!allowedStatuses.includes(status)) {
            throw new apiError(
                400,
                "Status must be planned, in_progress, or completed."
            );
        }

        const skillGap = await SkillGap.findById(
            skillGapId,
            userId
        );

        if (!skillGap) {
            throw new apiError(404, "Skill gap not found.");
        }

        const sprints = await Sprint.getBySkillGapId(skillGapId);

        const sprintExists = sprints.some(
            sprint => String(sprint.id) === String(sprintId)
        );

        if (!sprintExists) {
            throw new apiError(404, "Sprint not found.");
        }

        // Updated model call
        const result = await Sprint.updateStatus(
            skillGapId,
            sprintId,
            status
        );

        if (result.affectedRows === 0) {
            throw new apiError(404, "Sprint not found.");
        }

        return res.status(200).json(
            new apiResponse(
                200,
                {},
                "Sprint status updated successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

// Delete sprint
export const deleteSprint = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { skillGapId, sprintId } = req.params;

        validateUUID(skillGapId, "Skill gap ID");
        validateUUID(sprintId, "Sprint ID");

        const skillGap = await SkillGap.findById(
            skillGapId,
            userId
        );

        if (!skillGap) {
            throw new apiError(404, "Skill gap not found.");
        }

        const sprints = await Sprint.getBySkillGapId(skillGapId);

        const sprintExists = sprints.some(
            sprint => String(sprint.id) === String(sprintId)
        );

        if (!sprintExists) {
            throw new apiError(404, "Sprint not found.");
        }

        // Updated model call
        const result = await Sprint.delete(
            skillGapId,
            sprintId
        );

        if (result.affectedRows === 0) {
            throw new apiError(404, "Sprint not found.");
        }

        return res.status(200).json(
            new apiResponse(
                200,
                {},
                "Sprint deleted successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};
