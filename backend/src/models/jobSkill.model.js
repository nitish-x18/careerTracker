import db from "../config/db.js";

const JobSkill = {
    async add({ job_id, skill_id, required = 1 }) {
        const [result] = await db.execute(
            `INSERT INTO job_skills
             (job_id, skill_id, required)
             VALUES (?, ?, ?)`,
            [job_id, skill_id, required]
        );

        return result;
    },

    async getByJobId(job_id) {
        const [rows] = await db.execute(
            `SELECT
                js.job_id,
                js.skill_id,
                js.required,
                s.name
             FROM job_skills js
             JOIN skills s ON js.skill_id = s.id
             WHERE js.job_id = ?`,
            [job_id]
        );

        return rows;
    },

    async remove(job_id, skill_id) {
        const [result] = await db.execute(
            `DELETE FROM job_skills
             WHERE job_id = ? AND skill_id = ?`,
            [job_id, skill_id]
        );

        return result;
    }
};

export default JobSkill;