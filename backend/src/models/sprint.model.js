import db from "../config/db.js";

const Sprint = {
    async create(data) {
        const [result] = await db.execute(
            `INSERT INTO sprints
            (id, skill_gap_id, title, est_hours, status)
            VALUES (?, ?, ?, ?, ?)`,
            [
                data.id,
                data.skill_gap_id,
                data.title,
                data.est_hours,
                data.status || "planned"
            ]
        );

        return result;
    },

    async getBySkillGapId(skill_gap_id) {
        const [rows] = await db.execute(
            `SELECT * FROM sprints
             WHERE skill_gap_id = ?`,
            [skill_gap_id]
        );

        return rows;
    },

    async updateStatus(id, status) {
        const [result] = await db.execute(
            `UPDATE sprints
             SET status = ?
             WHERE id = ?`,
            [status, id]
        );

        return result;
    },

    async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM sprints
             WHERE id = ?`,
            [id]
        );

        return result;
    }
};

export default Sprint;