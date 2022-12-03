const express = require("express");
const router = express.Router();

/**
 * SIDE NODES WILL GET BLOCKS FROM MAIN NODE
 *  - upon creation, downloads all blocks
 *  - receive new blocks from MAIN node
 */

/**
 * side node will download all blocks
 */
router.get("/", async (req, res) => {});

/**
 * side node will receive new blocks
 */
router.post("/", async (req, res) => {});

module.exports = router;
