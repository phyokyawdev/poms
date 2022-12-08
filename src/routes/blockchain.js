const express = require('express');
const {
  allowMainNode,
  allowSideNode,
  isThisMain,
  isThisSide
} = require('../middlewares');
const router = express.Router();

/**
 * MAIN NODE ROUTES
 * - this node must be running as main
 * - handle getAllBlocks requests from side nodes
 */
router.get('/blocks', isThisMain, allowSideNode, async (req, res) => {
  const blocks = { blocks: [] };
  // create leveldb stream and post to /blocks
  res.send(blocks);
});

/**
 * SIDE NODE ROUTES
 * - this node must be running as side
 * - handle postNewBlock request from main node
 */
router.post('/blocks', isThisSide, allowMainNode, async (req, res) => {
  res.send('success');
});

module.exports = router;
