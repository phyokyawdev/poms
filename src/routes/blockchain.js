const log = require('debug')('info: blockchain route');
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
const {
  addNewBlock,
  exportBlocks,
  validateBlock
} = require('../services/blockchain');
const { executeTransaction } = require('../services/transaction');
const router = express.Router();

/**
 * MAIN NODE ROUTES
 * - this node must be running as main
 * - handle getAllBlocks requests from side nodes
 */
router.get('/blocks', isThisMain, allowSideNode, async (req, res) => {
  const blocks = await exportBlocks();
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

    log(`new block received: ${block.blockHash}`);

    // cache old state
    const productTrieRoot = productTrie.root;
    const manufacturerTrieRoot = manufacturerTrie.root;

    try {
      // validate with chain
      validateBlock(block);

      // update state via executing tx
      await executeTransaction(block.tx);

      // validate with state root
      if (block.productTrieRoot !== productTrie.root)
        throw new Error('Product trie root mismatched');
      if (block.manufacturerTrieRoot !== manufacturerTrie.root)
        throw new Error('Manufacturer trie root mismatched');

      // add block to blockchain
      await addNewBlock(block);
    } catch (error) {
      log(`Failed to process block, rolling state back`);

      // on error, roll back
      productTrie.root = productTrieRoot;
      manufacturerTrie.root = manufacturerTrieRoot;

      throw createHttpError(400, error.message);
    }

    res.send('success');
  }
);

module.exports = router;
