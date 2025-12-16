const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock do Sequelize antes de importar os models
jest.mock('../../src/config/sequelize');

const Category = require('../../src/models/Category');
const Transaction = require('../../src/models/Transaction');
const categoryController = require('../../src/controllers/categoryController');
const authMiddleware = require('../../src/middlewares/authMiddleware');

// Mock dos models
jest.mock('../../src/models/Category');
jest.mock('../../src/models/Transaction');

// Criar app de teste
const app = express();
app.use(express.json());
app.use(authMiddleware);

// Rotas
app.post('/addCategory', categoryController.createCategory);
app.get('/getAllCategories', categoryController.getAllCategories);
app.get('/getCategoryByName', categoryController.getCategoryByName);
app.get('/categorySpendingRanking', categoryController.getCategorySpendingRanking);

// Helper para gerar token válido
const generateToken = (userId = 1) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Category Routes', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = generateToken();
  });

  describe('POST /addCategory', () => {
    it('deve criar uma nova categoria com sucesso', async () => {
      const mockCategory = {
        id: 1,
        name: 'Alimentação'
      };

      Category.create = jest.fn().mockResolvedValue(mockCategory);

      const response = await request(app)
        .post('/addCategory')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Alimentação'
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Alimentação');
      expect(Category.create).toHaveBeenCalledWith({ name: 'Alimentação' });
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      Category.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/addCategory')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Alimentação'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to create category');
    });

    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app)
        .post('/addCategory')
        .send({
          name: 'Alimentação'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /getAllCategories', () => {
    it('deve retornar todas as categorias', async () => {
      const mockCategories = [
        { id: 1, name: 'Alimentação' },
        { id: 2, name: 'Transporte' },
        { id: 3, name: 'Lazer' }
      ];

      Category.findAll = jest.fn().mockResolvedValue(mockCategories);

      const response = await request(app)
        .get('/getAllCategories')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].name).toBe('Alimentação');
    });

    it('deve retornar array vazio se não houver categorias', async () => {
      Category.findAll = jest.fn().mockResolvedValue([]);

      const response = await request(app)
        .get('/getAllCategories')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      Category.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/getAllCategories')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to get categories');
    });
  });

  describe('GET /getCategoryByName', () => {
    it('deve retornar uma categoria pelo nome', async () => {
      const mockCategory = {
        id: 1,
        name: 'Alimentação'
      };

      Category.findOne = jest.fn().mockResolvedValue(mockCategory);

      const response = await request(app)
        .get('/getCategoryByName')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Alimentação'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Alimentação');
    });

    it('deve retornar erro 404 se a categoria não existir', async () => {
      Category.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/getCategoryByName')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Categoria Inexistente'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Category not found');
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      Category.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/getCategoryByName')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Alimentação'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to get category');
    });
  });

  describe('GET /categorySpendingRanking', () => {
    it('deve retornar o ranking de gastos por categoria', async () => {
      const mockRanking = [
        {
          category_id: 1,
          Category: { id: 1, name: 'Alimentação' },
          dataValues: {
            totalSpent: '1500.00',
            transactionCount: 10
          }
        },
        {
          category_id: 2,
          Category: { id: 2, name: 'Transporte' },
          dataValues: {
            totalSpent: '800.00',
            transactionCount: 5
          }
        }
      ];

      Transaction.findAll = jest.fn().mockResolvedValue(mockRanking);

      const response = await request(app)
        .get('/categorySpendingRanking')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: 1
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('ranking');
      expect(response.body).toHaveProperty('totalCategories');
      expect(response.body.ranking).toHaveLength(2);
      expect(response.body.ranking[0].category_name).toBe('Alimentação');
      expect(response.body.ranking[0].totalSpent).toBe(1500);
    });

    it('deve filtrar por período específico', async () => {
      Transaction.findAll = jest.fn().mockResolvedValue([]);

      const response = await request(app)
        .get('/categorySpendingRanking')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: 1,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          type: 'withdrawal'
        });

      expect(response.status).toBe(200);
      expect(response.body.filters.period).toEqual({
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      });
    });

    it('deve retornar erro 400 para tipo inválido', async () => {
      const response = await request(app)
        .get('/categorySpendingRanking')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'invalid_type'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid type');
    });

    it('deve retornar erro 400 para datas inválidas', async () => {
      const response = await request(app)
        .get('/categorySpendingRanking')
        .set('Authorization', `Bearer ${token}`)
        .send({
          startDate: 'invalid-date',
          endDate: '2024-12-31'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid date format');
    });

    it('deve retornar erro 400 se startDate for depois de endDate', async () => {
      const response = await request(app)
        .get('/categorySpendingRanking')
        .set('Authorization', `Bearer ${token}`)
        .send({
          startDate: '2024-12-31',
          endDate: '2024-01-01'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('startDate must be before endDate');
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      Transaction.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/categorySpendingRanking')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: 1
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to get category spending ranking');
    });
  });
});
