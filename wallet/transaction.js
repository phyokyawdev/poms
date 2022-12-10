const util = require('@ethereumjs/util');

/**
 * Create Transaction
 */
const create = (privateKey, txParams) => {
  // privateKey: '0x12344' -> privateKeyBuffer: Buffer
  const strippedPrivateKey = util.stripHexPrefix(privateKey);
  const privateKeyBuffer = Buffer.from(strippedPrivateKey, 'hex');

  // txParams: {} -> msgHash: Buffer
  const jsonTxParam = JSON.stringify(txParams);
  const msgHash = util.hashPersonalMessage(Buffer.from(jsonTxParam));

  // generate signature
  const ecdsaSignature = util.ecsign(msgHash, privateKeyBuffer);

  return { txParams, ecdsaSignature };
};

module.exports = {
  create
};
