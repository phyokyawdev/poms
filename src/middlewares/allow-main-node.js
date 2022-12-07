const { nodeType } = require('../config/keys');

const allowMainNode = (req, res, next) => {
  if (nodeType !== 'main') {
    return res
      .status(400)
      .send('Getting blocks from non-main node is not allowed');
  }

  next();
};

module.exports = allowMainNode;
