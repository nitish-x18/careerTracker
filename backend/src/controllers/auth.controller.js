import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

import User from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured.");
    }

    return jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new apiError(
                400,
                "Name, email, and password are required."
            );
        }

        if (typeof password !== "string" || password.length < 8) {
            throw new apiError(
                400,
                "Password must contain at least 8 characters."
            );
        }

        const existingUser = await User.findByEmail(
            email.trim().toLowerCase()
        );

        if (existingUser) {
            throw new apiError(409, "Email is already registered.");
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = {
            id: randomUUID(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password_hash: passwordHash,
            auth_provider: "email"
        };

        await User.create(user);

        const accessToken = generateAccessToken(user);

        return res.status(201).json(
            new apiResponse(
                201,
                {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        auth_provider: user.auth_provider
                    },
                    accessToken
                },
                "Registration successful."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            throw new apiError(400, "Email and password are required.");
        }

        const user = await User.findByEmail(
            email.trim().toLowerCase()
        );

        if (!user || !user.password_hash) {
            throw new apiError(401, "Invalid email or password.");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            throw new apiError(401, "Invalid email or password.");
        }

        const accessToken = generateAccessToken(user);

        return res.status(200).json(
            new apiResponse(
                200,
                {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        auth_provider: user.auth_provider
                    },
                    accessToken
                },
                "Login successful."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            throw new apiError(404, "User not found.");
        }

        return res.status(200).json(
            new apiResponse(
                200,
                { user },
                "User details retrieved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};