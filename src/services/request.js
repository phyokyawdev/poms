const log = require('debug')('info:request service');
const { default: axios } = require('axios');
const keys = require('../config/keys');

/**
 * POST REQUESTS
 */
const subscribeToMainNode = async () => {
  try {
    await axios.post(`${keys.mainIpAddress}/network/subscribe`, {
      port: keys.port
    });
  } catch (error) {
    throw new Error('Failed to subscribe to main node');
  }
};

const sendTransactionToMainNode = async (tx) => {
  try {
    await axios.post(`${keys.mainIpAddress}/transactions`, tx);
  } catch (error) {
    throw new Error('Failed to send transaction to main node');
  }
};

const publishBlockToSideNode = async (ipAddress, block) => {
  try {
    await axios.post(`${ipAddress}/blockchain/blocks`, block);
  } catch (error) {
    throw new Error(`Failed to publish block to ${ipAddress}`);
  }
};

/**
 * GET REQUESTS
 */
const getBlocksFromMainNode = async () => {
  try {
    const { data } = await axios.get(`${keys.mainIpAddress}/blockchain/blocks`);
    return data;
  } catch (error) {
    throw new Error('Failed to download blocks from main node');
  }
};

module.exports = {
  subscribeToMainNode,
  sendTransactionToMainNode,
  publishBlockToSideNode,
  getBlocksFromMainNode
};
