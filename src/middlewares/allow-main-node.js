const createHttpError = require('http-errors');
const keys = require('../config/keys');

/**
 * allowMainNode
 * =============
 * - only allow requests from main node
 */
const allowMainNode = (req, res, next) => {
  // check requester is main or not
  const { remoteAddress, remotePort } = req.socket;
  if (keys.mainAddress !== `http://${remoteAddress}:${remotePort}`) {
    const error = createHttpError(403, 'Only main node is allowed');
    return next(error);
  }
  next();
};

module.exports = allowMainNode;
