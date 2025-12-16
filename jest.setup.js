// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.TOKEN_EXPIRY = '1h';

// Mock do Sequelize globalmente
jest.mock('./src/config/sequelize', () => ({
  define: jest.fn().mockReturnValue({
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn()
  }),
  authenticate: jest.fn().mockResolvedValue(true),
  sync: jest.fn().mockResolvedValue(true)
}));
