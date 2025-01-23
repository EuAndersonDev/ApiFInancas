const modelTransacao = require("../models/modelTransacao");

const addTransacao = async (req, res) => {
    const { descricao, valor, data, tipo, usuario_id} = req.body;
    try{
        const createTransacao = await modelTransacao.addTransacao({ descricao, valor, data, tipo, usuario_id});
        return res.status(201).json(createTransacao);    
    } catch (error){
        console.log(error)
        return res.status(500).json({error: "Falhou em criar transição"})
    }
}

const getAllTransitions = async (req, res) => {
    const transacoes = await modelTransacao.getAllTransitions();
    return res.status(200).json(transacoes); 
}

module.exports = {
    addTransacao,
    getAllTransitions,
}