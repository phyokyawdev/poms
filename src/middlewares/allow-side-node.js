const createHttpError = require('http-errors');
const { getNetworkNode } = require('../services/network');

/**
 * allowSideNode
 * =============
 * - only allow requests from registered side nodes
 */
const allowSideNode = async (req, res, next) => {
  // check requester is registered side node or not
  const { remoteAddress } = req.socket;
  const side_node_address = `http://${remoteAddress}`;

  const subscribed_node = await getNetworkNode(side_node_address);

  if (!subscribed_node) {
    const error = createHttpError(403, 'Only registed side node is allowed');
    return next(error);
  }
  next();
};

module.exports = allowSideNode;
