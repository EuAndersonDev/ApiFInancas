const connection = require('../config/db');

const createUser = async (user) => {
    const { name, email, password } = user;
    const query = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    const [result] = await connection.execute(query, [name || null, email || null, password || null]);
    return result;
};

const getAllUsers = async () => {
    const query = "SELECT * FROM user";
    const [rows] = await connection.execute(query);
    return rows;
};

module.exports = {
    createUser,
    getAllUsers
};
