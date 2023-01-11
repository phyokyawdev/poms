const log = require('debug')('info:parseTransaction middleware');
const util = require('@ethereumjs/util');
const createHttpError = require('http-errors');

/**
 * parse valid transaction data to req.tx or terminate request
 * @param {*} req req.body is transaction data
 * @param {*} res
 * @param {*} next
 */
const parseTransaction = (req, res, next) => {
  /**
   * VALIDATE TRANSACTION DATA
   * - check req.body
   * - check txParams
   * - check ecdsaSignature
   */
  const tx = req.body;
  if (!tx) throw createHttpError(400, 'Transaction data not present');

  const { txParams, ecdsaSignature } = tx;

  if (!(txParams && txParams.methodName && txParams.payloads))
    throw createHttpError(400, 'txParams is missing some keys');

  if (
    !(
      ecdsaSignature &&
      ecdsaSignature.v &&
      ecdsaSignature.r &&
      ecdsaSignature.s
    )
  )
    throw createHttpError(400, 'ecdsaSignature is missing some keys');

  /**
   * PARSE & VALIDATE ECDSASIGNATURE
   * - v -> BigInt
   * - r -> Buffer
   * - s -> Buffer
   */
  let { v, r, s } = ecdsaSignature;
  try {
    v = BigInt(v);
    r = Buffer.from(r);
    s = Buffer.from(s);
  } catch (error) {
    log(error);
    throw createHttpError(400, 'Error parsing signature');
  }

  if (!util.isValidSignature(v, r, s))
    throw createHttpError(400, 'Invalid signature');

  /**
   * ADD VALID tx TO req
   * - req.tx
   * - call next route handler
   */
  tx.ecdsaSignature = { v, r, s };
  req.tx = tx;

  next();
};

module.exports = parseTransaction;
