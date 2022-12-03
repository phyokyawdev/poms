const debug = require("debug")("debug:nodes");
const express = require("express");
const router = express.Router();

/**
 * REGISTER SIDE NODES
 */
router.post("/", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  debug(`new side node with ip ${ip}`);

  res.send("subscribed successfully");
});

module.exports = router;
