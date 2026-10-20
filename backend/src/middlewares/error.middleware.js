import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const errorMiddleware = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof apiError)) {
        error = new apiError(
            error.statusCode || 500,
            error.statusCode && error.statusCode < 500
                ? error.message
                : "Internal server error"
        );
    }

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        ...new apiResponse(
            statusCode,
            null,
            error.message
        ),
        errors: error.errors || [],
        ...(process.env.NODE_ENV === "development"
            ? { stack: err.stack }
            : {})
    });
};