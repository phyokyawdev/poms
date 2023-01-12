const log = require('debug')('info:transaction route');
const { default: axios } = require('axios');
const express = require('express');
const createHttpError = require('http-errors');
const util = require('@ethereumjs/util');
const { nodeType, mainIpAddress } = require('../config/keys');
const { parseRequestTx } = require('../middlewares');
const { executeTransaction } = require('../services/transaction');
const { mineNewBlock } = require('../services/blockchain');
const { manufacturerTrie, productTrie } = require('../db');

const router = express.Router();

/**
 * CLIENT WILL CREATE NEW TRANSACTIONS
 * SIGNED WITH PRIVATE KEY.
 */
router.post('/', parseRequestTx, async (req, res) => {
  const tx = req.tx;

  const productTrieRoot = productTrie.root;
  const manufacturerTrieRoot = manufacturerTrie.root;

  // side node will delegate tx to main node
  if (nodeType === 'side') {
    const { status, data } = await axios.post(
      `${mainIpAddress}/transactions`,
      tx
    );
    return res.status(status).send(data);
  }

  // main node will handle all transactions
  let transactionResult;
  try {
    transactionResult = await executeTransaction(tx);
  } catch (error) {
    // on error, roll back
    productTrie.root = productTrieRoot;
    manufacturerTrie.root = manufacturerTrieRoot;

    log(error);
    throw createHttpError(400, error.message);
  }

  // blockchain.mineNewBlock with tx and updated state roots
  const block = await mineNewBlock(tx);

  // broadcast new block to network

  const parsedTransactionResult = parseTransactionResult(transactionResult);
  return res.status(200).send(parsedTransactionResult);
});

module.exports = router;

/**
 * Parse transactionResult
 * - if address string present -> add hex prefix 0x
 * @param {*} transactionResult
 * @returns transaction result with parsed addresses
 */
function parseTransactionResult(transactionResult) {
  const parsedTransactionResult = {};

  for (const key in transactionResult) {
    const val = transactionResult[key];
    if (util.isValidAddress(util.addHexPrefix(val)))
      parsedTransactionResult[key] = util.addHexPrefix(val);
    else parsedTransactionResult[key] = val;
  }

  return parsedTransactionResult;
}
