import db from "../config/db.js";

const User = {
    async create({ id, name, email, password_hash, auth_provider = "email" }) {
        const [result] = await db.execute(
            `INSERT INTO users
            (id, name, email, password_hash, auth_provider)
            VALUES (?, ?, ?, ?, ?)`,
            [id, name, email, password_hash, auth_provider]
        );

        return result;
    },

    async findByEmail(email) {
        const [rows] = await db.execute(
            `SELECT * FROM users WHERE email = ? LIMIT 1`,
            [email]
        );

        return rows[0];
    },

    async findById(id) {
        const [rows] = await db.execute(
            `SELECT id, name, email, auth_provider, created_at
             FROM users
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        return rows[0];
    },

    async update(id, { name, email }) {
        const [result] = await db.execute(
            `UPDATE users
             SET name = ?, email = ?
             WHERE id = ?`,
            [name, email, id]
        );

        return result;
    },

    async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM users WHERE id = ?`,
            [id]
        );

        return result;
    }
};

export default User;