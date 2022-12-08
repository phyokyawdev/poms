#!/usr/bin/env node

const log = require('debug')('info:index');
const ip = require('ip');
const axios = require('axios');
const keys = require('./config/keys');
const app = require('./app');

const IP_ADDRESS = ip.address();

/**
 * CLIENT SETUP
 * ============
 * main node
 * - genesis block?
 *
 * side node
 * - need main node address
 * - subscribe to main
 * - download old blocks
 */

const start = async () => {
  if (keys.nodeType === 'main') {
    log('Starting as main node...');
  } else if (keys.nodeType === 'side') {
    log(`Starting as side node with main node address : ${keys.mainAddress}`);

    /**
     * subscribe to main node
     */
    const res = await axios.post(`${keys.mainAddress}/network/subscribe`);
    if (res.status !== 200) throw Error('Subscription to main node failed');
    log(`Successfully subscribed to main node`);

    /**
     * get blocks from main node
     * and add to local blockchain
     */
    log(`Downloading old blocks...`);

    log(`Download completed`);
  } else {
    throw Error(`Node type is not defined`);
  }

  app.listen({ port: keys.port, host: '0.0.0.0' }, () => {
    log(`Listening on http://${IP_ADDRESS}:${keys.port}`);
  });
};

start().catch((err) => {
  log(err);
  process.exit(1);
});
