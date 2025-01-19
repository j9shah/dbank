import jwt from 'jsonwebtoken';

// Middleware to validate JWT token
export const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token missing or malformed' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT validation error:', error.message || error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};