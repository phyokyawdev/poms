const createHttpError = require('http-errors');
const keys = require('../config/keys');

// check current node type is side or not
const isThisSide = (req, res, next) => {
  if (keys.nodeType !== 'side') {
    const error = createHttpError(400, 'This node is not side node');
    return next(error);
  }
  next();
};

module.exports = isThisSide;
