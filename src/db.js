const { Level } = require('level');
const path = require('path');
const trie = require('./trie');

const dbPath = path.join(__dirname, '../database');
const db = new Level(dbPath);

/**
 * CHAIN DATA STORES
 */
const nodeStore = db.sublevel('node_store', { valueEncoding: 'json' });
const blockStore = db.sublevel('block_store', { valueEncoding: 'json' });

/**
 * STATE DATA STORES
 */
const accountStore = db.sublevel('account_store');
const manufacturerStore = db.sublevel('manufacturer_store');
const productStore = db.sublevel('product_store');

const accountTrie = trie.create(accountStore);
const manufacturerTrie = trie.create(manufacturerStore);
const productTrie = trie.create(productStore);

module.exports = {
  nodeStore,
  blockStore,
  accountTrie,
  manufacturerTrie,
  productTrie
};
