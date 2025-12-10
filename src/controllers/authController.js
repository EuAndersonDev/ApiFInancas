const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your_secret_key';
const tokenExpiry = process.env.TOKEN_EXPIRY || '1h';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: tokenExpiry });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
};

module.exports = { 
    login
};