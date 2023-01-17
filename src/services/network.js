/**
 * NETWORK SERVICE
 * MAIN NODE (use singleton)
 * - add side node
 * - broadcast new block
 */

// if empty, retrieve from leveldb (consider restart)
// upon new record, add to both memory and to leveldb
const crypto = require('crypto');
const log = require('debug')('info:network service');
const { nodeStore } = require('../db');

const algorithm = 'sha256';

const addNetworkNode = async (ipAddress, port) => {
  const hashObj = crypto.createHash(algorithm);
  const key = hashObj.update(ipAddress).digest();
  await nodeStore.put(key, { ipAddress, port });
};

const getNetworkNode = async (ipAddress) => {
  const hashObj = crypto.createHash(algorithm);
  const key = hashObj.update(ipAddress).digest();
  const val = await nodeStore.get(key);
  return val;
};

const getNodeAddresses = async () => {
  const entries = await nodeStore.iterator().all();

  const ipAddresses = entries.map(
    ([_key, { ipAddress, port }]) => `${ipAddress}:${port}`
  );

  return ipAddresses;
};

module.exports = {
  addNetworkNode,
  getNetworkNode,
  getNodeAddresses
};
