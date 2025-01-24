const transactionModel = require('../models/transactionModel');

const addTransaction = async (req, res) => {
    const { description, amount, date, type, user_id, account_id } = req.body;
    try {
        const createTransaction = await transactionModel.addTransaction({ description, amount, date, type, user_id, account_id });
        return res.status(201).json(createTransaction);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to create transaction" });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionModel.getAllTransactions();
        return res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to get transactions" });
    }
};

const getTransactionById = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await transactionModel.getTransactionById(id);
        return res.status(200).json(transaction);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to get transaction" });
    }
};

const updateTransaction = async (req, res) => {
    const { description, amount, date, type, user_id, account_id } = req.body;
    const { id } = req.params;
    try {
        const updateTransaction = await transactionModel.updateTransaction({ description, amount, date, type, user_id, account_id, id });
        return res.status(200).json(updateTransaction);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to update transaction" });
    }
};

const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteTransaction = await transactionModel.deleteTransaction(id);
        return res.status(200).json(deleteTransaction);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to delete transaction" });
    }
};

module.exports = {
    addTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};