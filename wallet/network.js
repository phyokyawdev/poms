const axios = require('axios');

const post = async (nodeIpAddress, transaction) => {
  const res = await axios.post(`${nodeIpAddress}/transactions`, transaction);
  return res.data;
};

module.exports = { post };
