const express = require('express');
const createHttpError = require('http-errors');
const { isThisMain } = require('../middlewares');
const networkService = require('../services/network');
const router = express.Router();

/**
 * MAIN NODE ROUTES
 * - this node must be running as main
 * - handle subscribe request from side node startup
 */
router.post('/subscribe', isThisMain, async (req, res) => {
  const { remoteAddress, remotePort } = req.socket;
  const side_node_address = `http://${remoteAddress}:${remotePort}`;
  log(`new side node at ${side_node_address}`);

  try {
    await networkService.addNode(side_node_address);
  } catch (error) {
    throw createHttpError(500, 'database error: side_nodes');
  }

  res.send('subscribed successfully');
});

module.exports = router;
