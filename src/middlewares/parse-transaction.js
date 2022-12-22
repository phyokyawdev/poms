const util = require('@ethereumjs/util');

const parseTransaction = (req, res, next) => {
  const { tx } = req.body;
  if (!tx) return next();

  const { txParams, ecdsaSignature } = tx;

  // parse hex address inside txParams.payloads
  if (txParams && txParams.payloads) {
    txParams.payloads = txParams.payloads.map((element) => {
      if (util.isHexString(element)) return util.stripHexPrefix(element);
      return element;
    });
  }

  // parse ecdsaSignature if exist
  if (ecdsaSignature) {
    let { v, r, s } = tx.ecdsaSignature;

    if (r) r = Buffer.from(r);

    if (s) s = Buffer.from(s);

    if (v) v = BigInt(v);

    tx.ecdsaSignature = { v, r, s };
  }

  req.body.tx = tx;

  next();
};

module.exports = parseTransaction;
