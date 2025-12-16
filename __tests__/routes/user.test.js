const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock do Sequelize antes de importar os models
jest.mock('../../src/config/sequelize');

const User = require('../../src/models/User');
const userController = require('../../src/controllers/userController');
const authMiddleware = require('../../src/middlewares/authMiddleware');

// Mock dos models
jest.mock('../../src/models/User');
jest.mock('../../src/models/Account');

// Criar app de teste
const app = express();
app.use(express.json());

// Rota pública
app.post('/register', userController.createUser);

// Rota protegida
app.get('/getAllUsers', authMiddleware, userController.getAllUsers);

// Helper para gerar token válido
const generateToken = (userId = 1) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('User Routes', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = generateToken();
  });

  describe('GET /getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
        { id: 3, name: 'User 3', email: 'user3@example.com' }
      ];

      User.findAll = jest.fn().mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/getAllUsers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].name).toBe('User 1');
    });

    it('deve retornar array vazio se não houver usuários', async () => {
      User.findAll = jest.fn().mockResolvedValue([]);

      const response = await request(app)
        .get('/getAllUsers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      User.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/getAllUsers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to retrieve users');
    });

    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app)
        .get('/getAllUsers');

      expect(response.status).toBe(401);
    });

    it('deve retornar erro 401 com token inválido', async () => {
      const response = await request(app)
        .get('/getAllUsers')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid or expired token');
    });
  });
});
