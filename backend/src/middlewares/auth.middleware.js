import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";

export const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new apiError(
                401,
                "Authentication required. Please log in."
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new apiError(401, "Access token is missing.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error instanceof apiError) {
            return next(error);
        }

        if (error.name === "TokenExpiredError") {
            return next(new apiError(401, "Access token has expired."));
        }

        if (error.name === "JsonWebTokenError") {
            return next(new apiError(401, "Invalid access token."));
        }

        return next(error);
    }
};