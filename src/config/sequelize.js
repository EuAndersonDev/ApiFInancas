const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.HOST,
        dialect: 'mysql',
        logging: false,
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established with Sequelize');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

testConnection();

module.exports = sequelize;
