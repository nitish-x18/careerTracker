import {db} from "../config/db.js";

const Job = {
    async create(data) {
        const [result] = await db.execute(
            `INSERT INTO jobs
            (
                id,
                company_id,
                title,
                type,
                season,
                location,
                pay,
                deadline,
                min_cgpa,
                work_auth_req,
                source_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.id,
                data.company_id,
                data.title,
                data.type,
                data.season,
                data.location,
                data.pay,
                data.deadline,
                data.min_cgpa,
                data.work_auth_req,
                data.source_url
            ]
        );

        return result;
    },

    async findById(id) {
        const [rows] = await db.execute(
            `SELECT
                j.*,
                c.name AS company_name,
                c.location AS company_location
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.id = ?`,
            [id]
        );

        return rows[0];
    },

    async getAll() {
        const [rows] = await db.execute(
            `SELECT
                j.*,
                c.name AS company_name
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             ORDER BY j.deadline ASC`
        );

        return rows;
    }
};

export default Job;