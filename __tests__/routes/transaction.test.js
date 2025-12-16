const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock do Sequelize antes de importar os models
jest.mock('../../src/config/sequelize');

const Transaction = require('../../src/models/Transaction');
const Account = require('../../src/models/Account');
const transactionController = require('../../src/controllers/transactionController');
const authMiddleware = require('../../src/middlewares/authMiddleware');

// Mock dos models
jest.mock('../../src/models/Transaction');
jest.mock('../../src/models/Account');
jest.mock('../../src/models/User');
jest.mock('../../src/models/Category');

// Criar app de teste
const app = express();
app.use(express.json());

// Aplicar middleware de autenticação
app.use(authMiddleware);

// Rotas
app.post('/addTransaction', transactionController.addTransaction);
app.get('/getAllTransactions', transactionController.getAllTransactions);
app.get('/getTransactionById/:id', transactionController.getTransactionById);
app.put('/updateTransaction/:id', transactionController.updateTransaction);
app.delete('/deleteTransaction/:id', transactionController.deleteTransaction);
app.get('/transactionsByCategory/:category_id', transactionController.transactionByCategory);
app.get('/transactionsByPeriod', transactionController.transactionByTime);
app.get('/transactionsByType', transactionController.transactionByType);

// Helper para gerar token válido
const generateToken = (userId = 1) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Transaction Routes', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = generateToken();
  });

  describe('POST /addTransaction', () => {
    it('deve criar uma nova transação de depósito', async () => {
      const mockAccount = {
        id: 1,
        balance: 100,
        save: jest.fn().mockResolvedValue(true)
      };

      const mockTransaction = {
        id: 1,
        description: 'Salário',
        amount: 1000,
        date: new Date(),
        type: 'deposit',
        user_id: 1,
        account_id: 1,
        category_id: 1
      };

      Account.findByPk = jest.fn().mockResolvedValue(mockAccount);
      Transaction.create = jest.fn().mockResolvedValue(mockTransaction);

      const response = await request(app)
        .post('/addTransaction')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Salário',
          amount: 1000,
          type: 'deposit',
          user_id: 1,
          account_id: 1,
          category_id: 1
        });

      expect(response.status).toBe(201);
      expect(response.body.description).toBe('Salário');
      expect(mockAccount.balance).toBe(1100);
      expect(mockAccount.save).toHaveBeenCalled();
    });

    it('deve criar uma nova transação de retirada', async () => {
      const mockAccount = {
        id: 1,
        balance: 1000,
        save: jest.fn().mockResolvedValue(true)
      };

      const mockTransaction = {
        id: 2,
        description: 'Compra',
        amount: 100,
        date: new Date(),
        type: 'withdrawal',
        user_id: 1,
        account_id: 1,
        category_id: 2
      };

      Account.findByPk = jest.fn().mockResolvedValue(mockAccount);
      Transaction.create = jest.fn().mockResolvedValue(mockTransaction);

      const response = await request(app)
        .post('/addTransaction')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Compra',
          amount: 100,
          type: 'withdrawal',
          user_id: 1,
          account_id: 1,
          category_id: 2
        });

      expect(response.status).toBe(201);
      expect(mockAccount.balance).toBe(900);
    });

    it('deve retornar erro 404 se a conta não existir', async () => {
      Account.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/addTransaction')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Compra',
          amount: 100,
          type: 'withdrawal',
          user_id: 1,
          account_id: 999,
          category_id: 2
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Account not found');
    });

    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app)
        .post('/addTransaction')
        .send({
          description: 'Compra',
          amount: 100,
          type: 'withdrawal',
          user_id: 1,
          account_id: 1,
          category_id: 2
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /getAllTransactions', () => {
    it('deve retornar todas as transações', async () => {
      const mockTransactions = [
        { id: 1, description: 'Salário', amount: 1000, type: 'deposit' },
        { id: 2, description: 'Compra', amount: 100, type: 'withdrawal' }
      ];

      Transaction.findAll = jest.fn().mockResolvedValue(mockTransactions);

      const response = await request(app)
        .get('/getAllTransactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].description).toBe('Salário');
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      Transaction.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/getAllTransactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to get transactions');
    });
  });

  describe('GET /getTransactionById/:id', () => {
    it('deve retornar uma transação por ID', async () => {
      const mockTransaction = {
        id: 1,
        description: 'Salário',
        amount: 1000,
        type: 'deposit'
      };

      Transaction.findByPk = jest.fn().mockResolvedValue(mockTransaction);

      const response = await request(app)
        .get('/getTransactionById/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.description).toBe('Salário');
    });

    it('deve retornar erro 404 se a transação não existir', async () => {
      Transaction.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/getTransactionById/999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Transaction not found');
    });
  });

  describe('PUT /updateTransaction/:id', () => {
    it('deve atualizar uma transação existente', async () => {
      const mockTransaction = {
        id: 1,
        description: 'Salário',
        amount: 1000,
        type: 'deposit',
        account_id: 1,
        update: jest.fn().mockResolvedValue(true)
      };

      const mockAccount = {
        id: 1,
        balance: 2000,
        save: jest.fn().mockResolvedValue(true)
      };

      Transaction.findByPk = jest.fn().mockResolvedValue(mockTransaction);
      Account.findByPk = jest.fn().mockResolvedValue(mockAccount);

      const response = await request(app)
        .put('/updateTransaction/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Salário atualizado',
          amount: 1500,
          type: 'deposit',
          user_id: 1,
          account_id: 1,
          category_id: 1
        });

      expect(response.status).toBe(200);
      expect(mockTransaction.update).toHaveBeenCalled();
    });

    it('deve retornar erro 404 se a transação não existir', async () => {
      Transaction.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/updateTransaction/999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Teste',
          amount: 100,
          type: 'deposit',
          user_id: 1,
          account_id: 1,
          category_id: 1
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Transaction not found');
    });
  });

  describe('DELETE /deleteTransaction/:id', () => {
    it('deve deletar uma transação existente', async () => {
      const mockTransaction = {
        id: 1,
        amount: 100,
        type: 'withdrawal',
        account_id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      const mockAccount = {
        id: 1,
        balance: 900,
        save: jest.fn().mockResolvedValue(true)
      };

      Transaction.findByPk = jest.fn().mockResolvedValue(mockTransaction);
      Account.findByPk = jest.fn().mockResolvedValue(mockAccount);

      const response = await request(app)
        .delete('/deleteTransaction/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Transaction deleted successfully');
      expect(mockAccount.balance).toBe(1000); // Reverte o saldo
      expect(mockTransaction.destroy).toHaveBeenCalled();
    });

    it('deve retornar erro 404 se a transação não existir', async () => {
      Transaction.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/deleteTransaction/999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Transaction not found');
    });
  });
});
