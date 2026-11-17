
import SavedSearch from "../models/savedSearch.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const createSavedSearch = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { filters } = req.body;

        if (
            !filters ||
            typeof filters !== "object" ||
            Array.isArray(filters)
        ) {
            throw new apiError(400, "Valid search filters object is required.");
        }

        const id = crypto.randomUUID();

        await SavedSearch.create({
            id,
            user_id: userId,
            filters
        });

        return res.status(201).json(
            new apiResponse(
                201,
                { savedSearchId: id },
                "Search saved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getMySavedSearches = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const savedSearches = await SavedSearch.getByUserId(userId);

        return res.status(200).json(
            new apiResponse(
                200,
                { savedSearches },
                "Saved searches retrieved successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

export const deleteSavedSearch = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        if (!id) {
            throw new apiError(400, "Saved search ID is required.");
        }

        const result = await SavedSearch.delete(id, userId);

        if (result.affectedRows === 0) {
            throw new apiError(404, "Saved search not found.");
        }

        return res.status(200).json(
            new apiResponse(
                200,
                {},
                "Saved search deleted successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};
