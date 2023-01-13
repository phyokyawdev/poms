const createHttpError = require('http-errors');
const { parseTransaction } = require('../services/transaction');
const Block = require('../services/block');

/**
 * parse valid block data to req.block or terminate request
 * @param {*} req req.body is block data
 * @param {*} res
 * @param {*} next
 */
const parseRequestBlock = (req, res, next) => {
  const blockData = req.body;
  if (!blockData) throw new createHttpError(400, 'Block data not present');

  const block = new Block(blockData);
  if (!block.validate())
    throw new createHttpError(400, 'Block is missing some properties');

  try {
    block.tx = parseTransaction(block.tx);
  } catch (error) {
    throw new createHttpError(400, 'Invalid tx data');
  }

  req.block = block;
  next();
};

module.exports = parseRequestBlock;
