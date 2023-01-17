const log = require('debug')('info:network');
const express = require('express');
const createHttpError = require('http-errors');
const { isThisMain } = require('../middlewares');
const { addNetworkNode } = require('../services/network');
const router = express.Router();

/**
 * MAIN NODE ROUTES
 * - this node must be running as main
 * - handle subscribe request from side node startup
 */
router.post('/subscribe', isThisMain, async (req, res) => {
  const { port } = req.body;

  const { remoteAddress } = req.socket;
  const side_node_address = `http://${remoteAddress}`;
  log(`new side node at ${side_node_address}:${port}`);

  try {
    await addNetworkNode(side_node_address, port);
  } catch (error) {
    throw createHttpError(500, 'database error: nodeStore');
  }

  res.send('subscribed successfully');
});

module.exports = router;
