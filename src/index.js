#!/usr/bin/env node

/**
 * Monkey patch BigInt
 */
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const log = require('debug')('info:index');
const ip = require('ip');
const keys = require('./config/keys');
const app = require('./app');
const { mineGenesisBlock, importBlocks } = require('./services/blockchain');
const {
  subscribeToMainNode,
  getBlocksFromMainNode
} = require('./services/request');
const Block = require('./services/block');
const {
  parseTransaction,
  executeTransaction
} = require('./services/transaction');

const IP_ADDRESS = ip.address();

/**
 * CLIENT STARTUP
 * ==============
 * main node
 * - mine genesis block
 * - restore old blocks?
 * - restore old state?
 *
 * side node
 * - subscribe to main node
 * - download old blocks from main node
 */

const start = async () => {
  if (keys.nodeType === 'main') {
    log(`Starting main node with account address : ${keys.mainAccountAddress}`);

    await mineGenesisBlock();
  } else {
    log(`Starting side node with main node ip address : ${keys.mainIpAddress}`);

    await subscribeToMainNode();

    log(`Downloading blocks from main...`);
    const blocks = await getBlocksFromMainNode();
    log(`Download completed, ${blocks}`);

    // parse blocks
    const parsedBlocks = blocks.map((block) => {
      const parsedBlock = new Block(block);
      if (parsedBlock.height === 0) return parsedBlock;

      parsedBlock.tx = parseTransaction(parsedBlock.tx);
      return parsedBlock;
    });

    // sort block according to height
    const sortedBlocks = parsedBlocks.sort((b1, b2) =>
      b1.height > b2.height ? 1 : b1.height < b2.height ? -1 : 0
    );

    // add to local block chain
    await importBlocks(sortedBlocks);

    // update state according to blocks
    await sortedBlocks.reduce(async (acc, elt) => {
      if (elt.height === 0) return Promise.resolve();
      console.log(elt);
      await executeTransaction(elt.tx);
    }, Promise.resolve());
  }

  app.listen({ port: keys.port, host: '0.0.0.0' }, () => {
    log(`Listening on http://${IP_ADDRESS}:${keys.port}`);
  });
};

start().catch((err) => {
  log(err);
  process.exit(1);
});
