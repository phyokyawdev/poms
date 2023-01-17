/**
 * BLOCKCHAIN SERVICE
 * - verify block
 * - generate new block
 * - mine(transaction):block  - limited to main node
 */
const log = require('debug')('info:blockchain service');
const util = require('@ethereumjs/util');
const { blockStore } = require('../db');
const Block = require('./block');

/**
 * Shared properties for BLOCKCHAIN SERVICE
 */
const EMPTY_TRIE_ROOT = util.KECCAK256_RLP_S;
const DIFFICULTY = 3;
let currentBlock;

/**
 * Create new block and add to local blockchain
 * @param {*} tx parsed transaction
 * @returns new block
 */
const mineNewBlock = async (tx, productTrieRoot, manufacturerTrieRoot) => {
  let block = new Block();

  // mine block
  block = block.mine(
    currentBlock.blockHash,
    currentBlock.height + 1,
    productTrieRoot,
    manufacturerTrieRoot,
    tx,
    DIFFICULTY
  );

  // add block to local block store
  await blockStore.put(block.height, block);

  log(`mined new block, block hash: ${block.blockHash}`);

  // update current block
  currentBlock = block;

  return block;
};

const mineGenesisBlock = async () => {
  const block = new Block();

  const genesisBlock = block.mine(
    '',
    0,
    EMPTY_TRIE_ROOT,
    EMPTY_TRIE_ROOT,
    {},
    DIFFICULTY
  );

  await blockStore.put(block.height, block);

  log(`mined genesis block, block hash: ${genesisBlock.blockHash}`);

  currentBlock = genesisBlock;

  return block;
};

/**
 * Add new block to blockStore
 * @param {*} block
 */
const addNewBlock = async (block) => {
  const blockInstance = new Block(block);

  // skip verfication for genesis block
  if (blockInstance.height === 0) {
    // add block to local block store
    await blockStore.put(block.height, blockInstance);

    // update current block
    currentBlock = blockInstance;
    return;
  }

  // verify height, previous block hash & difficulty
  validateBlock(blockInstance);

  // add block to local block store
  await blockStore.put(block.height, blockInstance);

  // update current block
  currentBlock = blockInstance;
};

/**
 * Add old blocks to blockStore
 * @param {*} blocks old blocks
 */
const importBlocks = async (blocks) => {
  // import all blocks
  await Promise.all(
    blocks.map(async (block) => await blockStore.put(block.height, block))
  );

  // update currentBlock
  currentBlock = blocks[blocks.length - 1];
};

/**
 * export old blocks from blockStore
 * @returns old blocks
 */
const exportBlocks = async () => {
  const entries = await blockStore.iterator().all();
  const blocks = entries.map(([key, value]) => value);
  return blocks;
};

module.exports = {
  mineGenesisBlock,
  mineNewBlock,
  addNewBlock,
  importBlocks,
  exportBlocks,
  validateBlock
};

function validateBlock(block) {
  if (block.height !== currentBlock.height + 1)
    throw new Error('Invalid block height');

  // verify previous block hash
  if (block.previousBlockHash !== currentBlock.blockHash)
    throw new Error('Invalid previous block hash');

  // verify block difficulty and structure
  if (!block.verify(DIFFICULTY)) throw new Error('Invalid block');
}
