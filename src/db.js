const { BaseTrie: Trie } = require('merkle-patricia-tree');
const { Level } = require('level');
const path = require('path');
const proxyHandler = require('./trie-proxy');
const keys = require('./config/keys');

const dbPath = path.join(__dirname, `../database/${keys.databasePath}`);
const db = new Level(dbPath);

/**
 * CHAIN DATA STORES
 */
const nodeStore = db.sublevel('node_store', { valueEncoding: 'json' });
const blockStore = db.sublevel('block_store', { valueEncoding: 'json' });

/**
 * STATE DATA STORES
 */
//const accountStore = db.sublevel('account_store');
const manufacturerStore = db.sublevel('manufacturer_store');
const productStore = db.sublevel('product_store');

/**
 * SETUP TRIES
 */
//const accountTrie = new Proxy(new Trie(accountStore), proxyHandler);
const manufacturerTrie = new Proxy(new Trie(manufacturerStore), proxyHandler);
const productTrie = new Proxy(new Trie(productStore), proxyHandler);

module.exports = {
  nodeStore,
  blockStore,
  manufacturerTrie,
  productTrie
};
