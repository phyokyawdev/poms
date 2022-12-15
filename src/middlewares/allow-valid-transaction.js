const createHttpError = require('http-errors');
const { isValidTransaction } = require('../services/transaction');

const allowValidTransaction = async (req, res, next) => {
  const tx = req.body;
  if (!tx) throw createHttpError(400, 'Transaction data not present');

  if (!isValidTransaction(tx))
    throw createHttpError(400, 'Invalid transaction signature');

  next();
};

module.exports = allowValidTransaction;
