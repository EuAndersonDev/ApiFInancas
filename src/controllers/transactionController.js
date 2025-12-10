const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const User = require('../models/User');
const Category = require('../models/Category');

const addTransaction = async (req, res) => {
    try {
        const { description, amount, date, type, user_id, account_id, category_id } = req.body;
        
        // Validar se conta existe
        const account = await Account.findByPk(account_id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        
        // Atualizar saldo da conta
        if (type === 'withdrawal') {
            account.balance -= amount;
        } else if (type === 'deposit') {
            account.balance += amount;
        }
        await account.save();
        
        // Criar transação
        const transaction = await Transaction.create({
            description,
            amount,
            date: date || new Date(),
            type,
            user_id,
            account_id,
            category_id,
        });
        
        return res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create transaction' });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Account, attributes: ['id', 'balance'] },
                { model: Category, attributes: ['id', 'name'] }
            ]
        });
        
        return res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get transactions' });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Account, attributes: ['id', 'balance'] },
                { model: Category, attributes: ['id', 'name'] }
            ]
        });
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        return res.status(200).json(transaction);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get transaction' });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, amount, date, type, user_id, account_id, category_id } = req.body;
        
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        // Se o tipo ou valor mudou, atualizar saldo
        const account = await Account.findByPk(account_id);
        if (account) {
            // Reverter transação anterior
            if (transaction.type === 'withdrawal') {
                account.balance += transaction.amount;
            } else if (transaction.type === 'deposit') {
                account.balance -= transaction.amount;
            }
            
            // Aplicar nova transação
            if (type === 'withdrawal') {
                account.balance -= amount;
            } else if (type === 'deposit') {
                account.balance += amount;
            }
            await account.save();
        }
        
        await transaction.update({
            description,
            amount,
            date: date || transaction.date,
            type,
            user_id,
            account_id,
            category_id,
        });
        
        return res.status(200).json(transaction);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update transaction' });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id);
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        // Reverter saldo
        const account = await Account.findByPk(transaction.account_id);
        if (account) {
            if (transaction.type === 'withdrawal') {
                account.balance += transaction.amount;
            } else if (transaction.type === 'deposit') {
                account.balance -= transaction.amount;
            }
            await account.save();
        }
        
        await transaction.destroy();
        return res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to delete transaction' });
    }
};

const transactionByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        const transactions = await Transaction.findAll({
            where: { category_id },
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Account, attributes: ['id', 'balance'] },
                { model: Category, attributes: ['id', 'name'] }
            ]
        });

        return res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get transactions by category' });
    }
};




module.exports = {
    addTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    transactionByCategory,

};