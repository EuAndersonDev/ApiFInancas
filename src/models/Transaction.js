const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');
const Account = require('./Account');
const Category = require('./Category');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    type: {
        type: DataTypes.ENUM('withdrawal', 'deposit'),
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    account_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Account,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Category,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'transaction',
    timestamps: false,
});

Transaction.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Transaction.belongsTo(Account, { foreignKey: 'account_id', onDelete: 'CASCADE' });
Transaction.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'CASCADE' });

User.hasMany(Transaction, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Account.hasMany(Transaction, { foreignKey: 'account_id', onDelete: 'CASCADE' });
Category.hasMany(Transaction, { foreignKey: 'category_id', onDelete: 'CASCADE' });

module.exports = Transaction;
