const connection = require('../config/db.js');

const addTransacao = async (transacao) => {
    const dataUTC = new Date().toISOString().split("T")[0];
    const { descricao, valor, data, tipo, usuario_id } = transacao;
    const dataFinal = dataUTC; 
    const query = "INSERT INTO transacao (descricao, valor, data, tipo, usuario_id) VALUES (?, ?, ?, ?, ?)";
    const [result] = await connection.execute(query, [descricao, valor, dataFinal, tipo, usuario_id]);
    return result;
};

const getAllTransitions = async () => {
    const [transacao] = await connection.execute("SELECT * FROM transacao");
    return transacao;
};

module.exports = {
    addTransacao,
    getAllTransitions,
}