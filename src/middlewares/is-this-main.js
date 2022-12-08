const createHttpError = require('http-errors');
const keys = require('../config/keys');

// check current node type is main or not
const isThisMain = (req, res, next) => {
  if (keys.nodeType !== 'main') {
    const error = createHttpError(400, 'This node is not main node');
    return next(error);
  }
  next();
};

module.exports = isThisMain;
