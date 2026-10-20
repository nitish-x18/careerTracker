import db from "../config/db.js";

const UserProfile = {
    async create({
        user_id,
        university,
        degree,
        major,
        cgpa,
        grad_year,
        work_auth
    }) {
        const [result] = await db.execute(
            `INSERT INTO user_profiles
            (user_id, university, degree, major, cgpa, grad_year, work_auth)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                university,
                degree,
                major,
                cgpa,
                grad_year,
                work_auth
            ]
        );

        return result;
    },

    async findByUserId(user_id) {
        const [rows] = await db.execute(
            `SELECT * FROM user_profiles
             WHERE user_id = ?`,
            [user_id]
        );

        return rows[0];
    },

    async update(user_id, data) {
        const [result] = await db.execute(
            `UPDATE user_profiles
             SET university = ?,
                 degree = ?,
                 major = ?,
                 cgpa = ?,
                 grad_year = ?,
                 work_auth = ?
             WHERE user_id = ?`,
            [
                data.university,
                data.degree,
                data.major,
                data.cgpa,
                data.grad_year,
                data.work_auth,
                user_id
            ]
        );

        return result;
    }
};

export default UserProfile;