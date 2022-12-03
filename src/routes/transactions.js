const express = require("express");
const router = express.Router();

/**
 * HANDLE TRANSACTIONS
 * (if MAIN node)
 * 1. validate transactions
 * 2. pool transactions
 * 3. start mining
 * 4. update state
 * 5. broadcast new block to network
 *
 * (if not Main node)
 * 1. validate transactions
 * 2. send transaction to MAIN node
 */
router.post("/", async (req, res) => {
  // validate transaction
  // pool transactions
  // start mining
  // update state
  // broadcast new block to network
});

module.exports = router;
