import {db} from "../config/db.js";

const Application = {
    async create(data) {
        const [result] = await db.execute(
            `INSERT INTO applications
            (
                id,
                user_id,
                job_id,
                resume_id,
                status,
                priority_level,
                match_score,
                priority_score,
                applied_date,
                deadline,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.id,
                data.user_id,
                data.job_id,
                data.resume_id,
                data.status || "saved",
                data.priority_level || "medium",
                data.match_score,
                data.priority_score,
                data.applied_date,
                data.deadline,
                data.notes
            ]
        );

        return result;
    },

    async findById(id, user_id) {
        const [rows] = await db.execute(
            `SELECT
                a.*,
                j.title AS job_title,
                c.name AS company_name
             FROM applications a
             LEFT JOIN jobs j ON a.job_id = j.id
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE a.id = ? AND a.user_id = ?`,
            [id, user_id]
        );

        return rows[0];
    },

    async getByUserId(user_id) {
        const [rows] = await db.execute(
            `SELECT
                a.*,
                j.title AS job_title,
                c.name AS company_name
             FROM applications a
             LEFT JOIN jobs j ON a.job_id = j.id
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE a.user_id = ?
             ORDER BY a.deadline ASC`,
            [user_id]
        );

        return rows;
    },

    async update(id, user_id, data) {
        const [result] = await db.execute(
            `UPDATE applications
             SET status = ?,
                 priority_level = ?,
                 notes = ?,
                 priority_score = ?,
                 match_score = ?
             WHERE id = ? AND user_id = ?`,
            [
                data.status,
                data.priority_level,
                data.notes,
                data.priority_score,
                data.match_score,
                id,
                user_id
            ]
        );

        return result;
    },

    async delete(id, user_id) {
        const [result] = await db.execute(
            `DELETE FROM applications
             WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );

        return result;
    }
};

export default Application;