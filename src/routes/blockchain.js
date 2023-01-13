const express = require('express');
const createHttpError = require('http-errors');
const { productTrie, manufacturerTrie } = require('../db');
const {
  allowMainNode,
  allowSideNode,
  isThisMain,
  isThisSide,
  parseRequestBlock
} = require('../middlewares');
const { addNewBlock } = require('../services/blockchain');
const { executeTransaction } = require('../services/transaction');
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
router.post(
  '/blocks',
  isThisSide,
  allowMainNode,
  parseRequestBlock,
  async (req, res) => {
    const block = req.block;

    console.log(`new block received: ${block.blockHash}`);

    // cache old state
    const productTrieRoot = productTrie.root;
    const manufacturerTrieRoot = manufacturerTrie.root;

    try {
      // update state via executing tx
      await executeTransaction(block.tx);

      // add block to blockchain
      await addNewBlock(block);
    } catch (error) {
      // on error, roll back
      productTrie.root = productTrieRoot;
      manufacturerTrie.root = manufacturerTrieRoot;

      throw createHttpError(400, error.message);
    }

    res.send('success');
  }
);

module.exports = router;
