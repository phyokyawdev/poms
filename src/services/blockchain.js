/**
 * BLOCKCHAIN SERVICE
 * - verify block
 * - generate new block
 * - mine(transaction):block  - limited to main node
 */
const log = require('debug')('info:blockchain service');
const { blockStore, productTrie, manufacturerTrie } = require('../db');
const Block = require('./block');

/**
 * Shared properties for BLOCKCHAIN SERVICE
 */
const DIFFICULTY = 3;
let currentBlock;

/**
 * Create new block and add to local blockchain
 * @param {*} tx parsed transaction
 * @returns new block
 */
const mineNewBlock = async (tx) => {
  let block = new Block();

  // mine block
  block = block.mine(
    currentBlock.blockHash,
    currentBlock.height + 1,
    productTrie.root,
    manufacturerTrie.root,
    tx,
    DIFFICULTY
  );

  // add block to local block store
  await blockStore.put(block.blockHash, block);

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
    productTrie.root,
    manufacturerTrie.root,
    {},
    DIFFICULTY
  );

  await blockStore.put(block.blockHash, block);

  log(`mined genesis block, block hash: ${genesisBlock.blockHash}`);

  currentBlock = genesisBlock;

  return block;
};

/**
 * Add new block to local block store
 */
const addNewBlock = async (block) => {
  const blockInstance = new Block(block);

  // skip verfication for genesis block
  if (blockInstance.height === 0) {
    // add block to local block store
    await blockStore.put(block.blockHash, blockInstance);

    // update current block
    currentBlock = blockInstance;
    return;
  }

  // verify height
  if (blockInstance.height !== currentBlock.height + 1)
    throw new Error('Invalid block height');

  // verify previous block hash
  if (blockInstance.previousBlockHash !== currentBlock.blockHash)
    throw new Error('Invalid previous block hash');

  // verify with state roots
  if (blockInstance.productTrieRoot !== productTrie.root)
    throw new Error('Invalid product trie root');
  if (blockInstance.manufacturerTrieRoot !== manufacturerTrie.root)
    throw new Error('Invalid manufacturer trie root');

  console.log(blockInstance.blockHash);
  // verify block difficulty and structure
  if (!blockInstance.verify(DIFFICULTY)) throw new Error('Invalid block');

  // add block to local block store
  await blockStore.put(block.blockHash, blockInstance);

  // update current block
  currentBlock = blockInstance;
};

module.exports = { mineGenesisBlock, mineNewBlock, addNewBlock };
