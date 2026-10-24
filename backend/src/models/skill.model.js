import {db} from "../config/db.js";

const Skill = {
    async create({ id, name }) {
        const [result] = await db.execute(
            `INSERT INTO skills (id, name)
             VALUES (?, ?)`,
            [id, name]
        );

        return result;
    },

    async findById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM skills WHERE id = ?`,
            [id]
        );

        return rows[0];
    },

    async findByName(name) {
        const [rows] = await db.execute(
            `SELECT * FROM skills WHERE name = ?`,
            [name]
        );

        return rows[0];
    },

    async getAll() {
        const [rows] = await db.execute(
            `SELECT * FROM skills ORDER BY name`
        );

        return rows;
    }
};

export default Skill;