#!/usr/bin/env node

/**
 * Monkey patch BigInt
 */
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const { default: axios } = require('axios');
const log = require('debug')('info:index');
const ip = require('ip');
const keys = require('./config/keys');
const app = require('./app');
const { mineGenesisBlock } = require('./services/blockchain');

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
    log(`Starting main node with account address : ${keys.mainAccountAddress}`);

    // mine genesis block
    await mineGenesisBlock();
  } else {
    log(`Starting side node with main node ip address : ${keys.mainIpAddress}`);

    /**
     * subscribe to main node
     */
    const res = await axios.post(`${keys.mainIpAddress}/network/subscribe`, {
      port: keys.port
    });
    if (res.status !== 200) throw Error('Subscription to main node failed');
    log(`Successfully subscribed to main node`);

    /**
     * get blocks from main node
     * and add to local blockchain
     */
    log(`Downloading old blocks...`);
    try {
      const { data } = await axios.get(
        `${keys.mainIpAddress}/blockchain/blocks`
      );

      // blocks
      // check height -> sort
      // execute and add to chain one by one
    } catch (error) {}

    log(`Download completed`);
  }

  app.listen({ port: keys.port, host: '0.0.0.0' }, () => {
    log(`Listening on http://${IP_ADDRESS}:${keys.port}`);
  });
};

start().catch((err) => {
  log(err);
  process.exit(1);
});
