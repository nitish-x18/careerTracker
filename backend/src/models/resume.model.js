import {db} from "../config/db.js";

const Resume = {
    async create({
        id,
        user_id,
        file_url,
        version,
        ats_score
    }) {
        const [result] = await db.execute(
            `INSERT INTO resumes
            (id, user_id, file_url, version, ats_score)
            VALUES (?, ?, ?, ?, ?)`,
            [id, user_id, file_url, version, ats_score]
        );

        return result;
    },

    async findById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM resumes
             WHERE id = ?`,
            [id]
        );

        return rows[0];
    },

    async getByUserId(user_id) {
        const [rows] = await db.execute(
            `SELECT * FROM resumes
             WHERE user_id = ?
             ORDER BY id DESC`,
            [user_id]
        );

        return rows;
    },

    async updateScore(id, ats_score) {
        const [result] = await db.execute(
            `UPDATE resumes
             SET ats_score = ?
             WHERE id = ?`,
            [ats_score, id]
        );

        return result;
    }
};

export default Resume;