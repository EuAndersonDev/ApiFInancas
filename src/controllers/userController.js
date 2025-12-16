const User = require('../models/User');
const Account = require('../models/Account');

const createUser = async (req, res) => {
    try {
        const { name, email, password, initialBalance = 0 } = req.body;
        
        const user = await User.create({ name, email, password });
        
        // Criar conta automaticamente para o novo usuário
        const account = await Account.create({
            balance: initialBalance,
            user_id: user.id
        });
    
        return res.status(201).json({
            user,
            account
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
}; 

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

module.exports = {
    createUser,
    getAllUsers
};