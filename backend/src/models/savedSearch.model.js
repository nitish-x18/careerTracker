import {db} from "../config/db.js";

const SavedSearch = {
    async create({ id, user_id, filters }) {
        const [result] = await db.execute(
            `INSERT INTO saved_searches
             (id, user_id, filters)
             VALUES (?, ?, ?)`,
            [
                id,
                user_id,
                JSON.stringify(filters)
            ]
        );

        return result;
    },

    async getByUserId(user_id) {
        const [rows] = await db.execute(
            `SELECT * FROM saved_searches
             WHERE user_id = ?`,
            [user_id]
        );

        return rows;
    },

    async delete(id, user_id) {
        const [result] = await db.execute(
            `DELETE FROM saved_searches
             WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );

        return result;
    }
};

export default SavedSearch;