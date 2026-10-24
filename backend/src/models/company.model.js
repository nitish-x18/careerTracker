import {db} from "../config/db.js";

const Company = {
    async create({ id, name, location }) {
        const [result] = await db.execute(
            `INSERT INTO companies (id, name, location)
             VALUES (?, ?, ?)`,
            [id, name, location]
        );

        return result;
    },

    async findById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM companies WHERE id = ?`,
            [id]
        );

        return rows[0];
    },

    async getAll() {
        const [rows] = await db.execute(
            `SELECT * FROM companies ORDER BY name`
        );

        return rows;
    }
};

export default Company;