const modelAccount = require('../models/accountModel');
const createAccount = async (req, res) => {
    const { balance, user_id } = req.body;
    try {
        const createAccount = await modelAccount.createAccount({ balance, user_id });
        return res.status(201).json(createAccount);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to create account" });
    }
};
const getAccountById = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await modelAccount.getAccountById(id);
        return res.status(200).json(account);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to get account" });
    }
};
const balance = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await modelAccount.balance(id);
        return res.status(200).json(account);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to get balance" });
    }
};
module.exports = {
    createAccount,
    getAccountById,
    balance
};