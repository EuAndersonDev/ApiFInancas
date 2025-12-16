const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock do Sequelize antes de importar os models
jest.mock('../../src/config/sequelize');

const Account = require('../../src/models/Account');
const User = require('../../src/models/User');
const accountController = require('../../src/controllers/accountController');
const authMiddleware = require('../../src/middlewares/authMiddleware');

// Mock dos models
jest.mock('../../src/models/Account');
jest.mock('../../src/models/User');

// Criar app de teste
const app = express();
app.use(express.json());
app.use(authMiddleware);

// Rotas
app.post('/addAccount', accountController.createAccount);
app.get('/getAccountById/:id', accountController.getAccountById);
app.get('/balance/:id', accountController.balance);

// Helper para gerar token válido
const generateToken = (userId = 1) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Account Routes', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = generateToken();
  });

  describe('POST /addAccount', () => {
    it('deve criar uma nova conta com sucesso', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
      const mockAccount = {
        id: 1,
        balance: 1000,
        user_id: 1
      };

      User.findByPk = jest.fn().mockResolvedValue(mockUser);
      Account.create = jest.fn().mockResolvedValue(mockAccount);

      const response = await request(app)
        .post('/addAccount')
        .set('Authorization', `Bearer ${token}`)
        .send({
          balance: 1000,
          user_id: 1
        });

      expect(response.status).toBe(201);
      expect(response.body.balance).toBe(1000);
      expect(response.body.user_id).toBe(1);
      expect(Account.create).toHaveBeenCalledWith({
        balance: 1000,
        user_id: 1
      });
    });

    it('deve retornar erro 404 se o usuário não existir', async () => {
      User.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/addAccount')
        .set('Authorization', `Bearer ${token}`)
        .send({
          balance: 1000,
          user_id: 999
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      User.findByPk = jest.fn().mockResolvedValue({ id: 1 });
      Account.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/addAccount')
        .set('Authorization', `Bearer ${token}`)
        .send({
          balance: 1000,
          user_id: 1
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to create account');
    });

    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app)
        .post('/addAccount')
        .send({
          balance: 1000,
          user_id: 1
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /getAccountById/:id', () => {
    it('deve retornar uma conta por ID', async () => {
      const mockAccount = {
        id: 1,
        balance: 1000,
        user_id: 1,
        User: { id: 1, name: 'Test User', email: 'test@example.com' }
      };

      Account.findByPk = jest.fn().mockResolvedValue(mockAccount);

      const response = await request(app)
        .get('/getAccountById/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.balance).toBe(1000);
    });

    it('deve retornar erro 404 se a conta não existir', async () => {
      Account.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/getAccountById/999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Account not found');
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      Account.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/getAccountById/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to get account');
    });
  });

  describe('GET /balance/:id', () => {
    it('deve retornar o saldo de uma conta', async () => {
      const mockAccount = {
        id: 1,
        balance: 5000
      };

      Account.findByPk = jest.fn().mockResolvedValue(mockAccount);

      const response = await request(app)
        .get('/balance/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.balance).toBe(5000);
    });

    it('deve retornar erro 404 se a conta não existir', async () => {
      Account.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/balance/999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Account not found');
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      Account.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/balance/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to get balance');
    });

    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app)
        .get('/balance/1');

      expect(response.status).toBe(401);
    });
  });
});
