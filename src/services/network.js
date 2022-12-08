/**
 * NETWORK SERVICE
 * MAIN NODE (use singleton)
 * - add side node
 * - broadcast new block
 */

// if empty, retrieve from leveldb (consider restart)
// upon new record, add to both memory and to leveldb
const crypto = require('crypto');
const db = require('../db');

const sideNodeDb = db.side_nodes;
const algorithm = 'sha256';
const hashObj = crypto.createHash(algorithm);

const addNode = async (value) => {
  const key = hashObj.update(value).digest();
  await sideNodeDb.put(key, value);
};

const getNode = async (value) => {
  const key = hashObj.update(value).digest();
  const val = await sideNodeDb.get(key);
  return val;
};

module.exports = {
  addNode,
  getNode
};
