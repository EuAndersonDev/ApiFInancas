const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock do Sequelize antes de importar os models
jest.mock('../../src/config/sequelize');

const User = require('../../src/models/User');
const authController = require('../../src/controllers/authController');
const userController = require('../../src/controllers/userController');

// Mock dos models
jest.mock('../../src/models/User');
jest.mock('../../src/models/Account');

// Criar app de teste
const app = express();
app.use(express.json());
app.post('/register', userController.createUser);
app.post('/login', authController.login);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword'
      };

      const mockAccount = {
        id: 1,
        balance: 0,
        user_id: 1
      };

      User.create = jest.fn().mockResolvedValue(mockUser);
      const Account = require('../../src/models/Account');
      Account.create = jest.fn().mockResolvedValue(mockAccount);

      const response = await request(app)
        .post('/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('account');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('deve retornar erro 500 se falhar ao criar usuário', async () => {
      User.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      
      // Verificar se o token é válido
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(1);
    });

    it('deve retornar erro 400 se email ou senha não forem fornecidos', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email and password are required');
    });

    it('deve retornar erro 401 se o usuário não existir', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('deve retornar erro 401 se a senha estiver incorreta', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});
