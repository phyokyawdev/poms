const debug = require("debug")("debug:index");
const ip = require("ip");
const app = require("./app");

const IP_ADDRESS = ip.address();
const PORT = process.env.PORT || 3000;
const BLOCKCHAIN_NODE_TYPE = process.env.BLOCKCHAIN_NODE_TYPE;
const MAIN_NODE_URL = process.env.MAIN_NODE_URL;

/**
 * THIS VERSION WILL USE POA CONSENSUS MECHANISM
 * =============================================
 * To start blockchain network with this program, either
 * 1. create main node, set env variables
 *    - BLOCKCHAIN_NODE_TYPE=MAIN or
 * 2. create side nodes with url of MAIN, set env variables
 *    - BLOCKCHAIN_NODE_TYPE=SIDE
 *    - MAIN_NODE_URL=(ip_address:port)
 */

const start = async () => {
  if (BLOCKCHAIN_NODE_TYPE === "MAIN") {
    debug("Starting as MAIN node...");
  } else {
    debug(`Starting as SIDE node...`);
    if (!MAIN_NODE_URL) {
      debug(`MAIN_NODE_URL is not provided, exiting...`);
      return;
    }

    // register SIDE node to MAIN node

    // download all blocks
  }

  app.listen(PORT, () => {
    debug(`Listening on http://${IP_ADDRESS}:${PORT}`);
  });
};

start();
