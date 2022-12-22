const createHttpError = require('http-errors');
const util = require('@ethereumjs/util');

/**
 * Allow valid transaction middleware
 * - check tx
 * - check tx.txParams & children
 * - check tx.ecdsaSignature & children
 * - validate signature
 */
const allowValidTransaction = async (req, res, next) => {
  const { tx } = req.body;
  if (!tx) throw createHttpError(400, 'Transaction data not present');

  const { txParams, ecdsaSignature } = tx;

  // check txParams
  if (!(txParams && txParams.methodName && txParams.payloads))
    throw createHttpError(400, 'txParams is missing some values');

  // check ecdsaSignature
  if (
    !(
      ecdsaSignature &&
      ecdsaSignature.v &&
      ecdsaSignature.r &&
      ecdsaSignature.s
    )
  )
    throw createHttpError(400, 'ecdsaSignature is missing some values');

  const { v, r, s } = ecdsaSignature;
  try {
    if (!util.isValidSignature(v, r, s))
      throw createHttpError(400, 'Invalid signature');
  } catch (error) {
    throw createHttpError(400, 'Invalid v,r,s');
  }

  next();
};

module.exports = allowValidTransaction;
