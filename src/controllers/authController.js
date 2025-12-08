const authModel = require('../models/authModel');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const user = await authModel.findUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const passwordMatch = await authModel.validatePassword(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = authModel.generateToken(user.id);
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
};

module.exports = { 
    login
};