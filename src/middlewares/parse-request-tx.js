const log = require('debug')('info:parseTransaction middleware');
const createHttpError = require('http-errors');
const { parseTransaction } = require('../services/transaction');

/**
 * parse valid transaction data to req.tx or terminate request
 * @param {*} req req.body is transaction data
 * @param {*} res
 * @param {*} next
 */
const parseRequestTx = (req, res, next) => {
  const tx = req.body;
  if (!tx) throw createHttpError(400, 'Transaction data not present');

  try {
    req.tx = parseTransaction(tx);
  } catch (error) {
    log(error);
    throw createHttpError(400, error.message);
  }

  next();
};

module.exports = parseRequestTx;
