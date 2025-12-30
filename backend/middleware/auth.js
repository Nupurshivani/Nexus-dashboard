const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      msg: 'Access denied. No token provided.'
    });
  }

  // Accept both "token" and "Bearer token" formats
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: 'Access denied. Invalid token format.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        msg: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        msg: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(401).json({
      success: false,
      msg: 'Authentication failed.'
    });
  }
};
