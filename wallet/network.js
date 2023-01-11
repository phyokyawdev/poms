const { default: axios } = require('axios');

const post = async (nodeIpAddress, tx) => {
  let res;
  try {
    res = await axios.post(`${nodeIpAddress}/transactions`, tx);

    return res.data;
  } catch (error) {
    //console.log(error);
    return error.response.data;
  }
};

module.exports = { post };
