const connection = require('../config/db');

const createUser = async (user) => {
    const { name, email, password } = user;
    const query = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    const [result] = await connection.execute(query, [name || null, email || null, password || null]);
    return result;
};

module.exports = {
    createUser
};
