require("dotenv").config();
const mysql = require("mysql2/promise");

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});

module.exports = connection;

const testConnection = async () => {
    try {
        await connection.getConnection();
        console.log("Database connection established");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

testConnection();