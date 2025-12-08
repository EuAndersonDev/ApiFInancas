const connection = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (user) => {
    const { name, email, password } = user;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    const [result] = await connection.execute(query, [name || null, email || null, hashedPassword || null]);
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
