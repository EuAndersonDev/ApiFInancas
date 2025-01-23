const express = require("express");
const router = express.Router();
const controllerTransacao = require("../controllers/controllerTransacao");

router.post("/addTransacao", controllerTransacao.addTransacao);
router.get("/getAllTransacoes", controllerTransacao.getAllTransitions)

module.exports = router;