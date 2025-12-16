const jwt = require('jsonwebtoken');
const authMiddleware = require('../../src/middlewares/authMiddleware');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('deve passar para o próximo middleware com token válido', () => {
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.headers.authorization = `Bearer ${token}`;

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBe(1);
  });

  it('deve retornar erro 401 se não houver token', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar erro 401 se o formato do token for inválido', () => {
    req.headers.authorization = 'InvalidFormat token123';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token format' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar erro 401 se o token for apenas "Bearer"', () => {
    req.headers.authorization = 'Bearer';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token format' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar erro 401 se o token estiver expirado', (done) => {
    const expiredToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: '-1s' });
    req.headers.authorization = `Bearer ${expiredToken}`;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
    done();
  });

  it('deve retornar erro 401 se o token for inválido', () => {
    req.headers.authorization = 'Bearer invalid_token_string';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar erro 401 se o token tiver uma assinatura incorreta', () => {
    const tokenWithWrongSecret = jwt.sign({ userId: 1 }, 'wrong_secret', { expiresIn: '1h' });
    req.headers.authorization = `Bearer ${tokenWithWrongSecret}`;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });
});
