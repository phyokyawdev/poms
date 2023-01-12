/**
 * NETWORK SERVICE
 * MAIN NODE (use singleton)
 * - add side node
 * - broadcast new block
 */

// if empty, retrieve from leveldb (consider restart)
// upon new record, add to both memory and to leveldb
const crypto = require('crypto');
const { nodeStore } = require('../db');

const algorithm = 'sha256';
const hashObj = crypto.createHash(algorithm);

const addNetworkNode = async (value) => {
  const key = hashObj.update(value).digest();
  await nodeStore.put(key, value);
};

const getNetworkNode = async (value) => {
  const key = hashObj.update(value).digest();
  const val = await nodeStore.get(key);
  return val;
};

// level-read-stream
// KeyStream
const publishBlock = async () => {
  // get value stream
  // post to blockchain route
  // ignore failed request (remove them?)
};

module.exports = {
  addNetworkNode,
  getNetworkNode
};
