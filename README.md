# API Finanças

## Descrição
A **API Finanças** é um sistema desenvolvido em **Node.js** com **MySQL** para gestão de transações financeiras. Ela permite adicionar, listar, atualizar e excluir transações, além de consultar o saldo atual.

## Tecnologias Utilizadas
- **Node.js**
- **Express.js**
- **MySQL**
- **Dotenv**
- **Docker** 

## Estrutura do Projeto
```
APIFINANCAS/
│── node_modules/
│── src/
│   ├── config/
│   │   ├── db.js
│   ├── controllers/
│   │   ├── accountController.js
│   │   ├── transactionController.js
│   │   ├── userController.js
│   ├── models/
│   │   ├── accountModel.js
│   │   ├── transactionModel.js
│   │   ├── userModel.js
│   ├── routes/
│   │   ├── routes.js
│   ├── app.js
│   ├── server.js
│── .env
│── database.sql
│── package.json
│── README.md
```

## Configuração do Banco de Dados
1. Crie um banco de dados MySQL e importe o arquivo `database.sql`.
2. Configure as credenciais do banco no arquivo `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=senha
   DB_NAME=nome_do_banco
   ```

## Instalação e Execução
1. Instale as dependências:
   ```sh
   npm install
   ```
2. Inicie o servidor:
   ```sh
   npm run dev
   ```

## Rotas da API

### Transações
- `GET /transactions` - Lista todas as transações
- `POST /transactions` - Adiciona uma nova transação
- `GET /transactions/{id}` - Obtém detalhes de uma transação específica
- `PUT /transactions/{id}` - Atualiza uma transação
- `DELETE /transactions/{id}` - Exclui uma transação
- `GET /balance` - Obtém o saldo atual

## Contato
Desenvolvido por **Anderson Reis**. Para mais informações, acesse [Linkedin](https://www.linkedin.com/in/anderson-reis-5407311b3/).

