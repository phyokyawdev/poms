const log = require('debug')('info:parseTransaction middleware');
const util = require('@ethereumjs/util');

/**
 * Parse transaction data if present
 * tx.txParams.payloads - strip 0x prefix from hex string
 * tx.ecdsaSignature (v, r, s) - parse to buffer and bigint
 */
const parseTransaction = (req, res, next) => {
  const { tx } = req.body;
  if (!tx) return next();

  const { txParams, ecdsaSignature } = tx;

  // parse txParams.payloads
  if (txParams && txParams.payloads) {
    tx.txParams.payloads = txParams.payloads.map((element) => {
      if (util.isHexString(element)) return util.stripHexPrefix(element);
      return element;
    });
  }

  // parse ecdsaSignature
  if (ecdsaSignature) {
    try {
      let { v, r, s } = ecdsaSignature;
      if (r) r = Buffer.from(r);
      if (s) s = Buffer.from(s);
      if (v) v = BigInt(v);
      tx.ecdsaSignature = { v, r, s };
    } catch (error) {
      // if error happen, do nothing
      log(error);
    }
  }

  // replace tx with parsedTx
  req.body.tx = tx;
  next();
};

module.exports = parseTransaction;
