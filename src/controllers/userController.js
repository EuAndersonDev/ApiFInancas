const User = require('../models/User');

const createUser = async (req, res) => {
    try {
        const { name, email, password} = req.body;
        
        const user = await User.create({ name, email, password });
    
        return res.status(201).json(user);
        
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