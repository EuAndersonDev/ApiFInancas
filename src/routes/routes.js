const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const userController = require("../controllers/userController");
const accountController = require("../controllers/accountController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

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

module.exports = router;