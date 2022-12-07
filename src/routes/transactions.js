const express = require('express');
const router = express.Router();
const { nodeType } = require('../config/keys');

/**
 * CLIENT WILL CREATE NEW TRANSACTIONS
 * SIGNED WITH PRIVATE KEY.
 */
router.post('/', async (req, res) => {
  /**
   * FOR SIDE NODE
   */
  if (nodeType !== 'main') {
    // validate tx

    // send tx to main node

    return res.status(200).send('Submitted transaction to main node');
  }

  /**
   * FOR MAIN NODE
   */

  // validate tx
  // update state
  // start mining
  // broadcast new block to network
  return res.status(201).send('Transaction created');
});

module.exports = router;
