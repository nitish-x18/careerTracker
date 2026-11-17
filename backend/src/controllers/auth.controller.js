
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateAccessToken } from "../utils/jwt.utils.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

// REGISTER USER
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            throw new apiError(
                400,
                "Name, email and password are required."
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findByEmail(normalizedEmail);

        if (existingUser) {
            throw new apiError(409, "Email is already registered.");
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = {
            id: randomUUID(),
            name: name.trim(),
            email: normalizedEmail,
            password_hash: passwordHash,
            auth_provider: "email"
        };

        await User.create(user);

        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email
        });

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

// LOGIN USER
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

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findByEmail(normalizedEmail);

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

        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email
        });

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

// GET CURRENT LOGGED-IN USER
export const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (!user) {
            throw new apiError(404, "User not found.");
        }

        return res.status(200).json(
            new apiResponse(
                200,
                {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        auth_provider: user.auth_provider
                    }
                },
                "User details fetched successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};
