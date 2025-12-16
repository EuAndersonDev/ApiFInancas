const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const { Op, fn, col, sequelize } = require('sequelize');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        const category = await Category.create({ name });
        return res.status(201).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create category' });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        return res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get categories' });
    }
};

const getCategoryByName = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findOne({ where: { name } });
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        return res.status(200).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get category' });
    }
};



const getCategorySpendingRanking = async (req, res) => {
    try {
        const { user_id, startDate, endDate, type } = req.body;

        // Construir filtro
        const whereClause = {};

        // Filtrar por tipo de transação (geralmente queremos apenas withdrawal/gastos)
        if (type) {
            if (!['deposit', 'withdrawal'].includes(type)) {
                return res.status(400).json({ error: 'Invalid type. Must be "deposit" or "withdrawal"' });
            }
            whereClause.type = type;
        } else {
            // Por padrão, filtrar apenas gastos (withdrawal)
            whereClause.type = 'withdrawal';
        }

        // Filtrar por usuário se fornecido
        if (user_id) {
            whereClause.user_id = user_id;
        }

        // Filtrar por período se fornecido
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
            }

            if (start > end) {
                return res.status(400).json({ error: 'startDate must be before endDate' });
            }

            whereClause.date = {
                [Op.between]: [start, end]
            };
        }

        // Buscar transações agrupadas por categoria com soma total
        const categorySpending = await Transaction.findAll({
            attributes: [
                [col('Transaction.category_id'), 'category_id'],
                [fn('SUM', col('Transaction.amount')), 'totalSpent'],
                [fn('COUNT', col('Transaction.id')), 'transactionCount']
            ],
            where: whereClause,
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                    required: true
                }
            ],
            group: ['Transaction.category_id', 'Category.id'],
            raw: false,
            subQuery: false,
            order: [[fn('SUM', col('amount')), 'DESC']]
        });

        // Formatar resposta
        const formattedData = categorySpending.map(item => ({
            category_id: item.category_id,
            category_name: item.Category.name,
            totalSpent: parseFloat(item.dataValues.totalSpent),
            transactionCount: item.dataValues.transactionCount
        }));

        return res.status(200).json({
            filters: {
                type: type || 'withdrawal',
                user_id: user_id || 'all',
                period: startDate && endDate ? {
                    startDate,
                    endDate
                } : 'all'
            },
            totalCategories: formattedData.length,
            ranking: formattedData
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get category spending ranking' });
    }
};



module.exports = {
    createCategory,
    getAllCategories,
    getCategoryByName,
    getCategorySpendingRanking
};
