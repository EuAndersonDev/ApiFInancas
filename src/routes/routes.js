const express = require("express");
const router = express.Router();
const controllerTransacao = require("../controllers/controllerTransacao");

router.post("/addTransacao", controllerTransacao.addTransacao);
router.get("/getAllTransacoes", controllerTransacao.getAllTransitions);
router.get("/getTransacaoById/:id", controllerTransacao.getTransacaoById);
router.put("/updateTransacao/:id", controllerTransacao.updateTransacao);
router.delete("/deleteTransacao/:id", controllerTransacao.deleteTransacao);


module.exports = router;