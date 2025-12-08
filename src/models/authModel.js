const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');

const secretKey = process.env.JWT_SECRET || 'your_secret_key';
const tokenExpiry = process.env.TOKEN_EXPIRY || '1h';

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM user WHERE email = ?';
    const [results] = await connection.execute(query, [email]);
    return results.length > 0 ? results[0] : null;
};

const validatePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, secretKey, { expiresIn: tokenExpiry });
};

module.exports = {
    findUserByEmail,
    validatePassword,
    generateToken
};
