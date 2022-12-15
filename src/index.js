#!/usr/bin/env node

const { default: axios } = require('axios');
const log = require('debug')('info:index');
const ip = require('ip');
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
    log(`Starting main node with account address : ${keys.mainAccountAddress}`);
  } else {
    log(`Starting side node with main node ip address : ${keys.mainIpAddress}`);

    /**
     * subscribe to main node
     */
    const res = await axios.post(`${keys.mainIpAddress}/network/subscribe`);
    if (res.status !== 200) throw Error('Subscription to main node failed');
    log(`Successfully subscribed to main node`);

    /**
     * get blocks from main node
     * and add to local blockchain
     */
    log(`Downloading old blocks...`);

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
