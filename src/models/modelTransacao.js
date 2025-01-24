const connection = require('../config/db.js');

const addTransacao = async (transacao) => {
    const dataUTC = new Date().toISOString().split("T")[0];
    const { descricao, valor, data, tipo, usuario_id } = transacao;
    const dataFinal = data || dataUTC; 
    const query = "INSERT INTO transacao (descricao, valor, data, tipo, usuario_id) VALUES (?, ?, ?, ?, ?)";
    const [result] = await connection.execute(query, [descricao, valor, dataFinal, tipo, usuario_id]);
    return result;
};

const getAllTransitions = async () => {
    const [transacao] = await connection.execute("SELECT * FROM transacao");
    return transacao;
};

const getTransacaoById = async (id) => {
    const [transacao] = await connection.execute("SELECT * FROM transacao WHERE id = ?", [id]);
    return transacao;
};

const updateTransacao = async (transacao) => {
    const { descricao, valor, data, tipo, usuario_id, id } = transacao;
    const query = "UPDATE transacao SET descricao = ?, valor = ?, data = ?, tipo = ?, usuario_id = ? WHERE id = ?";
    const [result] = await connection.execute(query, [
        descricao || null,
        valor || null,
        data || null,
        tipo || null,
        usuario_id || null,
        id || null
    ]);
    return result;
};

const deleteTransacao = async (id) => {
    const query = "DELETE FROM transacao WHERE id = ?";
    const [result] = await connection.execute(query, [id]);
    return result;
};

module.exports = {
    addTransacao,
    getAllTransitions,
    getTransacaoById,
    updateTransacao,
    deleteTransacao
}