const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { config } = require('../config/config');
const { UserRole } = require('../constants/enums');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token is required',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('department');

    if (!user || !user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
