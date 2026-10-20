import db from "../config/db.js";

const ApplicationEvent = {
    async create({
        id,
        application_id,
        event_type,
        scheduled_at,
        details
    }) {
        const [result] = await db.execute(
            `INSERT INTO application_events
            (id, application_id, event_type, scheduled_at, details)
            VALUES (?, ?, ?, ?, ?)`,
            [
                id,
                application_id,
                event_type,
                scheduled_at,
                details
            ]
        );

        return result;
    },

    async getByApplicationId(application_id) {
        const [rows] = await db.execute(
            `SELECT * FROM application_events
             WHERE application_id = ?
             ORDER BY scheduled_at ASC`,
            [application_id]
        );

        return rows;
    },

    async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM application_events
             WHERE id = ?`,
            [id]
        );

        return result;
    }
};

export default ApplicationEvent;