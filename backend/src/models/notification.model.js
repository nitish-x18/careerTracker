import db from "../config/db.js";

const Notification = {
    async create(data) {
        const [result] = await db.execute(
            `INSERT INTO notifications
            (id, user_id, application_id, type, due_at, is_read)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.id,
                data.user_id,
                data.application_id,
                data.type,
                data.due_at,
                data.is_read || 0
            ]
        );

        return result;
    },

    async getByUserId(user_id) {
        const [rows] = await db.execute(
            `SELECT * FROM notifications
             WHERE user_id = ?
             ORDER BY due_at ASC`,
            [user_id]
        );

        return rows;
    },

    async markAsRead(id, user_id) {
        const [result] = await db.execute(
            `UPDATE notifications
             SET is_read = 1
             WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );

        return result;
    }
};

export default Notification;