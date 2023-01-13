/**
 * NETWORK SERVICE
 * MAIN NODE (use singleton)
 * - add side node
 * - broadcast new block
 */

// if empty, retrieve from leveldb (consider restart)
// upon new record, add to both memory and to leveldb
const { default: axios } = require('axios');
const crypto = require('crypto');
const log = require('debug')('info:network service');
const { nodeStore } = require('../db');

const algorithm = 'sha256';

const addNetworkNode = async (value) => {
  const hashObj = crypto.createHash(algorithm);
  const key = hashObj.update(value).digest();
  await nodeStore.put(key, value);
};

const getNetworkNode = async (value) => {
  const hashObj = crypto.createHash(algorithm);
  const key = hashObj.update(value).digest();
  const val = await nodeStore.get(key);
  return val;
};

const publishBlock = async (block) => {
  for await (const ipAddress of nodeStore.values()) {
    try {
      log(`publishing to ${ipAddress}`);
      await axios.post(`${ipAddress}/blockchain/blocks`, block);
      log(`published block to ${ipAddress}`);
    } catch (error) {
      log(error.response.data);
    }
  }
};

module.exports = {
  addNetworkNode,
  getNetworkNode,
  publishBlock
};
