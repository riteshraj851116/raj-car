import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing. Please log in.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'dev-only-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired session. Please log in again.' });
    }
    req.user = user;
    next();
  });
};

export const requireOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Owner privileges required to access this endpoint.' });
  }
  next();
};
