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

const getTransacaoById = async (req, res) => {
    const { id } = req.params;
    const transacao = await modelTransacao.getTransacaoById(id);
    return res.status(200).json(transacao);
};

const updateTransacao = async (req, res) => {
    const { descricao, valor, data, tipo, usuario_id } = req.body;
    const { id } = req.params;
    try{
        const updateTransacao = await modelTransacao.updateTransacao({ descricao, valor, data, tipo, usuario_id, id });
        return res.status(200).json(updateTransacao);
    } catch (error){
        console.log(error)
        return res.status(500).json({error: "Falhou em atualizar transição"})
    }
};

const deleteTransacao = async (req, res) => {
    const { id } = req.params;
    try{
        const deleteTransacao = await modelTransacao.deleteTransacao(id);
        return res.status(200).json(deleteTransacao);
    } catch (error){
        console.log(error)
        return res.status(500).json({error: "Falhou em deletar transição"})
    }
};

module.exports = {
    addTransacao,
    getAllTransitions,
    getTransacaoById,
    updateTransacao,
    deleteTransacao,
}