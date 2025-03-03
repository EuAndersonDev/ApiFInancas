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



module.exports = {
    createUser
};