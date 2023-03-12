const jwt = require('jsonwebtoken');
const User = require('../models/users');

const isAdminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    // Check if the authenticated user is an admin
    if (user.role !== 'admin') {
      throw new Error('Access forbidden');
    }

    next();
  } catch (error) {
    res.status(401).json({ error: error.message || 'Invalid or expired token' });
  }
};

module.exports = isAdminAuthMiddleware;
