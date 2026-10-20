import db from "../config/db.js";

const ResumeSkill = {
    async add({ resume_id, skill_id, verified = 0 }) {
        const [result] = await db.execute(
            `INSERT INTO resume_skills
             (resume_id, skill_id, verified)
             VALUES (?, ?, ?)`,
            [resume_id, skill_id, verified]
        );

        return result;
    },

    async getByResumeId(resume_id) {
        const [rows] = await db.execute(
            `SELECT
                rs.resume_id,
                rs.skill_id,
                rs.verified,
                s.name
             FROM resume_skills rs
             JOIN skills s ON rs.skill_id = s.id
             WHERE rs.resume_id = ?`,
            [resume_id]
        );

        return rows;
    },

    async remove(resume_id, skill_id) {
        const [result] = await db.execute(
            `DELETE FROM resume_skills
             WHERE resume_id = ? AND skill_id = ?`,
            [resume_id, skill_id]
        );

        return result;
    }
};

export default ResumeSkill;