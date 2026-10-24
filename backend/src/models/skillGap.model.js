import {db} from "../config/db.js";

const SkillGap = {
    async create(data) {
        const [result] = await db.execute(
            `INSERT INTO skill_gaps
            (
                id,
                user_id,
                skill_id,
                urgency,
                ats_boost,
                frequency_pct
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.id,
                data.user_id,
                data.skill_id,
                data.urgency,
                data.ats_boost,
                data.frequency_pct
            ]
        );

        return result;
    },

    async getByUserId(user_id) {
        const [rows] = await db.execute(
            `SELECT
                sg.*,
                s.name AS skill_name
             FROM skill_gaps sg
             JOIN skills s ON sg.skill_id = s.id
             WHERE sg.user_id = ?
             ORDER BY sg.urgency DESC`,
            [user_id]
        );

        return rows;
    },

    async findById(id, user_id) {
        const [rows] = await db.execute(
            `SELECT
                sg.*,
                s.name AS skill_name
             FROM skill_gaps sg
             JOIN skills s ON sg.skill_id = s.id
             WHERE sg.id = ? AND sg.user_id = ?`,
            [id, user_id]
        );

        return rows[0];
    }
};

export default SkillGap;