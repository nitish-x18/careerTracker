import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: true
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        const [rows] = await db.query(
            "SELECT DATABASE() AS database_name"
        );

        console.log("TiDB Cloud Database Connected");
        console.log("Connected database:", rows[0].database_name);
    } catch (error) {
        console.error("Database Connection Failed:", error.message);
        throw error;
    }
};

export { db, connectDB };