const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const User = require('../models/User');
const Category = require('../models/Category');
const { Op } = require('sequelize');

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

const transactionByTime = async (req, res) => {
    try {
        const { startDate, endDate, user_id } = req.body;

        // Validações
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'startDate and endDate are required' });
        }

        // Converter as datas para o formato correto
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Ajustar a data final para incluir todo o dia
        end.setHours(23, 59, 59, 999);

        // Validar datas
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        }

        if (start > end) {
            return res.status(400).json({ error: 'startDate must be before endDate' });
        }

        // Construir filtro
        const whereClause = {
            date: {
                [Op.between]: [start, end]
            }
        };

        // Se user_id foi fornecido, adicionar ao filtro
        if (user_id) {
            whereClause.user_id = user_id;
        }

        const transactions = await Transaction.findAll({
            where: whereClause,
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Account, attributes: ['id', 'balance'] },
                { model: Category, attributes: ['id', 'name'] }
            ],
            order: [['date', 'DESC']]
        });

        return res.status(200).json({
            period: {
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0]
            },
            count: transactions.length,
            transactions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get transactions by period of time' });
    }
};

const transactionByType = async (req, res) => {
    try {
        const { type, user_id } = req.body;

        if (!type) {
            return res.status(400).json({ error: 'type parameter is required (deposit or withdrawal)' });
        }

        if (!['deposit', 'withdrawal'].includes(type)) {
            return res.status(400).json({ error: 'Invalid type. Must be "deposit" or "withdrawal"' });
        }

        const whereClause = { type };

        if (user_id) {
            whereClause.user_id = user_id;
        }

        const transactions = await Transaction.findAll({
            where: whereClause,
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Account, attributes: ['id', 'balance'] },
                { model: Category, attributes: ['id', 'name'] }
            ],
            order: [['date', 'DESC']]
        });

        return res.status(200).json({
            type: type,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get transactions by type' });
    }
};




module.exports = {
    addTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    transactionByCategory,
    transactionByTime,
    transactionByType
};