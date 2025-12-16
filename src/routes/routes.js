const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const userController = require("../controllers/userController");
const accountController = require("../controllers/accountController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const categoryController = require("../controllers/categoryController");


// Public routes
router.post("/register", userController.createUser);
router.post("/login", authController.login);

// Protected routes
router.post("/addTransaction", authMiddleware, transactionController.addTransaction);
router.get("/getAllTransactions", authMiddleware, transactionController.getAllTransactions);
router.get("/getTransactionById/:id", authMiddleware, transactionController.getTransactionById);
router.put("/updateTransaction/:id", authMiddleware, transactionController.updateTransaction);
router.delete("/deleteTransaction/:id", authMiddleware, transactionController.deleteTransaction);

router.get("/getAllUsers", authMiddleware, userController.getAllUsers);

router.post("/addAccount", authMiddleware, accountController.createAccount);
router.get("/getAccountById/:id", authMiddleware, accountController.getAccountById);
router.get("/balance/:id", authMiddleware, accountController.balance);

router.post("/addCategory", authMiddleware, categoryController.createCategory);
router.get("/getAllCategories", authMiddleware, categoryController.getAllCategories);
router.get("/getCategoryByName", authMiddleware, categoryController.getCategoryByName);
router.get("/categorySpendingRanking", authMiddleware, categoryController.getCategorySpendingRanking);

router.get("/transactionsByCategory/:category_id", authMiddleware, transactionController.transactionByCategory);
router.get("/transactionsByPeriod", authMiddleware, transactionController.transactionByTime);
router.get("/transactionsByType", authMiddleware, transactionController.transactionByType);

module.exports = router;