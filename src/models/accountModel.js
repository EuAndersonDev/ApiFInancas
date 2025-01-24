const connection = require('../config/db');

const createAccount = async (account) => {
    const { balance, user_id } = account;
    const query = "INSERT INTO accounts (balance, user_id) VALUES (?, ?)";
    const [result] = await connection.execute(query, [balance || null, user_id || null]);
    return result;
};

const getAccountById = async (id) => {
    const query = "SELECT * FROM accounts WHERE id = ?";
    const [result] = await connection.execute(query, [id]);
    return result;
};

module.exports = {
    createAccount,
    getAccountById
};