const Account = require('../models/Account');
const User = require('../models/User');

const createAccount = async (req, res) => {
    try {
        const { balance, user_id } = req.body;
        
        const userExists = await User.findByPk(user_id);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const account = await Account.create({ balance, user_id });
        return res.status(201).json(account);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create account' });
    }
};

const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await Account.findByPk(id, {
            include: [User]
        });
        
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        
        return res.status(200).json(account);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get account' });
    }
};

const balance = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await Account.findByPk(id, {
            attributes: ['balance']
        });
        
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        
        return res.status(200).json({ balance: account.balance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get balance' });
    }
};

module.exports = {
    createAccount,
    getAccountById,
    balance
};