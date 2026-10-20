import {db} from "../config/db.js";

const UserPreference = {
    async create({
        id,
        user_id,
        career_stage,
        career_goal,
        education_level,
        academic_year,
        work_mode,
        preferred_location,
        skills,
        onboarding_completed = 0
    }) {
        const [result] = await db.execute(
            `INSERT INTO user_preferences
            (
                id,
                user_id,
                career_stage,
                career_goal,
                education_level,
                academic_year,
                work_mode,
                preferred_location,
                skills,
                onboarding_completed
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                user_id,
                career_stage,
                career_goal,
                education_level,
                academic_year,
                work_mode,
                preferred_location,
                JSON.stringify(skills),
                onboarding_completed
            ]
        );

        return result;
    },

    async findByUserId(user_id) {
        const [rows] = await db.execute(
            `SELECT * FROM user_preferences
             WHERE user_id = ?`,
            [user_id]
        );

        return rows[0];
    },

    async update(user_id, data) {
        const [result] = await db.execute(
            `UPDATE user_preferences
             SET career_stage = ?,
                 career_goal = ?,
                 education_level = ?,
                 academic_year = ?,
                 work_mode = ?,
                 preferred_location = ?,
                 skills = ?,
                 onboarding_completed = ?
             WHERE user_id = ?`,
            [
                data.career_stage,
                data.career_goal,
                data.education_level,
                data.academic_year,
                data.work_mode,
                data.preferred_location,
                JSON.stringify(data.skills),
                data.onboarding_completed,
                user_id
            ]
        );

        return result;
    }
};

export default UserPreference;