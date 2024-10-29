const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  // Only replace if the header is present
  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;  // Decodes token and assigns it to req.user
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
