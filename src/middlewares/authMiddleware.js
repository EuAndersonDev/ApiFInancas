const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Invalid token format' });
        }
        
        const token = parts[1];
        const secretKey = process.env.JWT_SECRET || 'your_secret_key';
        
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded.userId;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;