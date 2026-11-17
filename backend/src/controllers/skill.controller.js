
import Skill from "../models/skill.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createSkill = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            throw new apiError(400, "Skill name is required.");
        }

        const skillName = name.trim();

        const existingSkill = await Skill.findByName(skillName);

        if (existingSkill) {
            throw new apiError(409, "Skill already exists.");
        }

        const id = crypto.randomUUID();

        await Skill.create({
            id,
            name: skillName
        });

        const skill = await Skill.findById(id);

        return res.status(201).json(
            new apiResponse(201, { skill }, "Skill created successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getAllSkills = async (req, res, next) => {
    try {
        const skills = await Skill.getAll();

        return res.status(200).json(
            new apiResponse(200, { skills }, "Skills retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};

export const getSkillById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new apiError(400, "Skill ID is required.");
        }

        const skill = await Skill.findById(id);

        if (!skill) {
            throw new apiError(404, "Skill not found.");
        }

        return res.status(200).json(
            new apiResponse(200, { skill }, "Skill retrieved successfully.")
        );
    } catch (error) {
        next(error);
    }
};
