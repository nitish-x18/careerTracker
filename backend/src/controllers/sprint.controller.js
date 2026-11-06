
import Sprint from "../models/sprint.model.js";
import SkillGap from "../models/skillGap.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createSprint = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { skill_gap_id, title, est_hours } = req.body;

        if (!skill_gap_id || !title || !title.trim()) {
            throw new apiError(400, "Skill gap ID and sprint title are required.");
        }

        if (
            est_hours === undefined ||
            !Number.isFinite(Number(est_hours)) ||
            Number(est_hours) <= 0
        ) {
            throw new apiError(400, "Estimated hours must be a positive number.");
        }

        const skillGap = await SkillGap.findById(skill_gap_id, userId);

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
            new apiResponse(201, { sprintId: id }, "Sprint created successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getMySprints = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { skillGapId } = req.params;

        if (!skillGapId) {
            throw new apiError(400, "Skill gap ID is required.");
        }

        const skillGap = await SkillGap.findById(skillGapId, userId);

        if (!skillGap) {
            throw new apiError(404, "Skill gap not found.");
        }

        const sprints = await Sprint.getBySkillGapId(skillGapId);

        return res.status(200).json(
            new apiResponse(200, { sprints }, "Sprints retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const updateSprintStatus = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { skillGapId, sprintId } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["planned", "in_progress", "completed"];

        if (!allowedStatuses.includes(status)) {
            throw new apiError(
                400,
                "Status must be planned, in_progress, or completed."
            );
        }

        const skillGap = await SkillGap.findById(skillGapId, userId);

        if (!skillGap) {
            throw new apiError(404, "Skill gap not found.");
        }

        const sprints = await Sprint.getBySkillGapId(skillGapId);
        const sprintExists = sprints.some(sprint => sprint.id === sprintId);

        if (!sprintExists) {
            throw new apiError(404, "Sprint not found.");
        }

        await Sprint.updateStatus(sprintId, status);

        return res.status(200).json(
            new apiResponse(200, {}, "Sprint status updated successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const deleteSprint = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { skillGapId, sprintId } = req.params;

        const skillGap = await SkillGap.findById(skillGapId, userId);

        if (!skillGap) {
            throw new apiError(404, "Skill gap not found.");
        }

        const sprints = await Sprint.getBySkillGapId(skillGapId);
        const sprintExists = sprints.some(sprint => sprint.id === sprintId);

        if (!sprintExists) {
            throw new apiError(404, "Sprint not found.");
        }

        await Sprint.delete(sprintId);

        return res.status(200).json(
            new apiResponse(200, {}, "Sprint deleted successfully.")
        );
    } catch (error) {
        next(error);
    }
};
