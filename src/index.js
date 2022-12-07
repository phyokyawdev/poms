#!/usr/bin/env node

const log = require('debug')('info:index');
const ip = require('ip');
const keys = require('./config/keys');
const app = require('./app');

const IP_ADDRESS = ip.address();

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
  if (keys.nodeType === 'main') {
    log('Starting as main node...');
  } else if (keys.nodeType === 'side') {
    log(`Starting as side node with main address : ${keys.mainAddress}`);
  }

  /**
   * subscribe side node via
   * POST /blockchain/subscribe  to MAIN node
   */

  /**
   * get all blocks via
   * GET /blockchain/blocks  to MAIN node
   */

  app.listen({ port: keys.port, host: '0.0.0.0' }, () => {
    log(`Listening on http://${IP_ADDRESS}:${keys.port}`);
  });
};

start().catch((err) => {
  log(err);
  process.exit(1);
});
