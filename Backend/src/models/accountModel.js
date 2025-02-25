const connection = require('../config/db');

const createAccount = async (account) => {
    const { balance, user_id } = account;
    const query = "INSERT INTO account (balance, user_id) VALUES (?, ?)";
    const [result] = await connection.execute(query, [balance || null, user_id || null]);
    return result;
};

const getAccountById = async (id) => {
    const query = "SELECT * FROM account WHERE id = ?";
    const [result] = await connection.execute(query, [id]);
    return result;
};

const balance = async (id) => {
    const query = "SELECT balance FROM account WHERE id = ?";
    const [result] = await connection.execute(query, [id]);
    return result;
};

module.exports = {
    createAccount,
    getAccountById,
    balance
};