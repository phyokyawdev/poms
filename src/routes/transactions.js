const log = require('debug')('info:transaction route');
const express = require('express');
const createHttpError = require('http-errors');
const keys = require('../config/keys');
const { parseRequestTx } = require('../middlewares');
const { executeTransaction } = require('../services/transaction');
const { mineNewBlock } = require('../services/blockchain');
const { getNodeAddresses } = require('../services/network');
const { manufacturerTrie, productTrie } = require('../db');
const {
  sendTransactionToMainNode,
  publishBlockToSideNode
} = require('../services/request');

const router = express.Router();

/**
 * CLIENT WILL CREATE NEW TRANSACTIONS
 * SIGNED WITH PRIVATE KEY.
 */
router.post('/', parseRequestTx, async (req, res) => {
  const tx = req.tx;

  const productTrieRoot = productTrie.root;
  const manufacturerTrieRoot = manufacturerTrie.root;

  if (keys.nodeType === 'side') {
    await sendTransactionToMainNode(tx);
    return res.send('Sent transaction to main node');
  }

  let transactionResult;
  try {
    transactionResult = await executeTransaction(tx);
    const block = await mineNewBlock(
      tx,
      productTrie.root,
      manufacturerTrie.root
    );

    /**
     * PUBLISH BLOCK TO SIDE NODES
     * - optimistic approach (no fail)
     */
    try {
      const addresses = await getNodeAddresses();
      addresses.forEach(
        async (address) => await publishBlockToSideNode(address, block)
      );
    } catch (error) {
      log(error);
    }
  } catch (error) {
    log(`Failed to execute transaction, rolling state back`);

    productTrie.root = productTrieRoot;
    manufacturerTrie.root = manufacturerTrieRoot;

    log(error);
    throw createHttpError(400, error.message);
  }

  return res.status(200).send(transactionResult);
});

module.exports = router;
