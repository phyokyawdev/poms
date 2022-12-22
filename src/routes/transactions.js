const log = require('debug')('info:transaction route');
const { default: axios } = require('axios');
const express = require('express');
const createHttpError = require('http-errors');
const router = express.Router();
const { nodeType, mainIpAddress } = require('../config/keys');
const { allowValidTransaction, parseTransaction } = require('../middlewares');
const { executeTransaction } = require('../services/transaction');

/**
 * CLIENT WILL CREATE NEW TRANSACTIONS
 * SIGNED WITH PRIVATE KEY.
 * - allowValidTransaction
 */
router.post('/', parseTransaction, allowValidTransaction, async (req, res) => {
  const { tx } = req.body;

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
    log(error);
    throw createHttpError(400, error.message);
  }

  // get the state root (account, manufacturer, product)

  // mine

  // add block to blockchain

  // broadcast to network

  return res.status(200).send(transactionResult);
});

module.exports = router;
