const userModel = require('../models/userModel');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const createUser = await userModel.createUser({ name, email, password });
        return res.status(201).json(createUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to create user" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to retrieve users" });
    }
};



module.exports = {
    createUser,
    getAllUsers
};