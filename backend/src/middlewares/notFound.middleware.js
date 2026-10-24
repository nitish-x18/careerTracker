import { apiError } from "../utils/apiError.js";

export const notFoundMiddleware = (req, res, next) => {
    next(
        new apiError(
            404,
            `Route not found: ${req.method} ${req.originalUrl}`
        )
    );
};