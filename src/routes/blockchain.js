const log = require("debug")("info:routes/blockchain");
const express = require("express");
const { allowMainNode } = require("../middlewares");
const router = express.Router();

/**
 * MAIN NODE WILL HANDLE SUBSCRIPTION
 * REQUESTS FROM SIDE NODES.
 */
router.post("/subscribe", allowMainNode, async (req, res) => {
  const { remoteAddress, remotePort } = req.socket;
  log(`new side node at http://${remoteAddress}:${remotePort}`);

  /**
   * UPON SUBSCRIPTION,
   * 1. store ip_address of subscriber
   * networkService.addNode()
   */

  res.send("subscribed successfully");
});

/**
 * MAIN NODE WILL HANDLE BLOCKS
 * REQUESTS FROM SIDE NODES
 */
router.get("/blocks", allowMainNode, async (req, res) => {
  // const blocks = blockchainService.getBlocks();
  const blocks = { blocks: [] };
  res.send(blocks);
});

module.exports = router;
