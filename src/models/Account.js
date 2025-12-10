const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    balance: {
        type: DataTypes.DECIMAL(19, 2),
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
}, {
    tableName: 'account',
    timestamps: false,
});

Account.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Account, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = Account;
