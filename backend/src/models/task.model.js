import {db} from "../config/db.js";

const Task = {
    async create(data) {
        const [result] = await db.execute(
            `INSERT INTO tasks
            (id, user_id, application_id, title, est_mins, done)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.id,
                data.user_id,
                data.application_id,
                data.title,
                data.est_mins,
                data.done || 0
            ]
        );

        return result;
    },

    async getByUserId(user_id) {
        const [rows] = await db.execute(
            `SELECT * FROM tasks
             WHERE user_id = ?
             ORDER BY done ASC`,
            [user_id]
        );

        return rows;
    },

    async update(id, user_id, data) {
        const [result] = await db.execute(
            `UPDATE tasks
             SET title = ?,
                 est_mins = ?,
                 done = ?
             WHERE id = ? AND user_id = ?`,
            [
                data.title,
                data.est_mins,
                data.done,
                id,
                user_id
            ]
        );

        return result;
    },

    async delete(id, user_id) {
        const [result] = await db.execute(
            `DELETE FROM tasks
             WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );

        return result;
    }
};

export default Task;