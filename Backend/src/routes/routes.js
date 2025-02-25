const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const userController = require("../controllers/userController");
const accountController = require("../controllers/accountController");

router.post("/addTransaction", transactionController.addTransaction);
router.get("/getAllTransactions", transactionController.getAllTransactions);
router.get("/getTransactionById/:id", transactionController.getTransactionById);
router.put("/updateTransaction/:id", transactionController.updateTransaction);
router.delete("/deleteTransaction/:id", transactionController.deleteTransaction);

router.post("/addUser", userController.createUser);

router.post("/addAccount", accountController.createAccount);
router.get("/getAccountById/:id", accountController.getAccountById);
router.get("/balance/:id", accountController.balance);

module.exports = router;