// Setup para os testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.TOKEN_EXPIRY = '1h';

// Mock do Sequelize para evitar conexão real com o banco
jest.mock('../src/config/sequelize', () => ({
  Sequelize: {
    DataTypes: {}
  },
  sequelize: {
    define: jest.fn(),
    authenticate: jest.fn()
  }
}));
