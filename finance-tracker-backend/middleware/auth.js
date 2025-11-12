// middleware/auth.js
const jwt = require('jsonwebtoken');

// NOTE: Secret key MUST match the one in index.js
const JWT_SECRET = "your-very-secret-key-for-auth"; 

// Middleware function to check for a valid JWT
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token from "Bearer TOKEN"

      const decoded = jwt.verify(token, JWT_SECRET);

      // CRITICAL STEP: Attach the user's ID to the request
      req.userId = decoded.userId; 

      next();
    } catch (error) {
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };