const connection = require('../config/db.js');

const addTransaction = async (transaction) => {
    const dataUTC = new Date().toISOString().split("T")[0];
    const { description, amount, date, type, user_id, account_id } = transaction;
    const finalDate = date || dataUTC; 
    const query = "INSERT INTO transaction (description, amount, date, type, user_id, account_id) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await connection.execute(query, [description, amount, finalDate, type, user_id, account_id]);

    let balanceQuery;
    if (type === 'withdrawal') {
        balanceQuery = "UPDATE account SET balance = balance - ? WHERE id = ?";
    } else if (type === 'deposit') {
        balanceQuery = "UPDATE account SET balance = balance + ? WHERE id = ?";
    }
    if (balanceQuery) {
        await connection.execute(balanceQuery, [amount, account_id]);
    }

    return result;
};

const getAllTransactions = async () => {
    const [transactions] = await connection.execute("SELECT * FROM transaction");
    return transactions;
};

const getTransactionById = async (id) => {
    const [transaction] = await connection.execute("SELECT * FROM transaction WHERE id = ?", [id]);
    return transaction;
};

const updateTransaction = async (transaction) => {
    const { description, amount, date, type, user_id, account_id, id } = transaction;
    const query = "UPDATE transaction SET description = ?, amount = ?, date = ?, type = ?, user_id = ?, account_id = ? WHERE id = ?";
    const [result] = await connection.execute(query, [
        description || null,
        amount || null,
        date || null,
        type || null,
        user_id || null,
        account_id || null,
        id || null
    ]);

    let balanceQuery;
    if (type === 'withdrawal') {
        balanceQuery = "UPDATE account SET balance = balance - ? WHERE id = ?";
    } else if (type === 'deposit') {
        balanceQuery = "UPDATE account SET balance = balance + ? WHERE id = ?";
    }
    if (balanceQuery) {
        await connection.execute(balanceQuery, [amount, account_id]);
    }

    return result;
};

const deleteTransaction = async (id) => {
    const query = "DELETE FROM transaction WHERE id = ?";
    const [result] = await connection.execute(query, [id]);
    return result;
};

module.exports = {
    addTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};