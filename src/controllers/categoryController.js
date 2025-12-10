const Category = require('../models/Category');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        const category = await Category.create({ name });
        return res.status(201).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create category' });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        return res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get categories' });
    }
};

const getCategoryByName = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findOne({ where: { name } });
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        return res.status(200).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get category' });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryByName,
};
