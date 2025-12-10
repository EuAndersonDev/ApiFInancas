const sequelize = require('../config/sequelize');
const User = require('./User');
const Account = require('./Account');
const Category = require('./Category');
const Transaction = require('./Transaction');

// Sincronizar modelos com o banco de dados
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: false });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Database synchronization failed:', error);
    }
};

module.exports = {
    User,
    Account,
    Category,
    Transaction,
    sequelize,
    syncDatabase
};
