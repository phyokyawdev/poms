const util = require('@ethereumjs/util');
const { enrollManufacturer } = require('./manufacturer');
const { enrollProduct, shipProduct, receiveProduct } = require('./product');

/**
 * Verify if signature of transaction is valid.
 * @param tx transaction
 * @param tx.txParams tx param object:
 * @param tx.ecdsaSignature tx signature object: { v, r, s }
 */
const isValidTransaction = (tx) => {
  const { ecdsaSignature } = tx;
  if (!ecdsaSignature) return false;

  const { v, r, s } = ecdsaSignature;
  if (!v || !r || !s) return false;

  try {
    return util.isValidSignature(v, r, s);
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Execute account, manufacturer and product methods
 * according to txParams object.
 * @param tx transaction
 * @param tx.txParams tx param object:
 * @param tx.ecdsaSignature tx signature object: { v, r, s }
 */
const executeTransaction = async (tx) => {
  const { txParams } = tx;

  const senderAddress = getSenderAddress(tx);
  const { methodName, payloads } = txParams;

  let transactionResult;

  switch (methodName) {
    case 'enrollManufacturer':
      transactionResult = await enrollManufacturer(senderAddress, ...payloads);
      break;

    case 'enrollProduct':
      transactionResult = await enrollProduct(senderAddress, ...payloads);
      break;

    case 'shipProduct':
      transactionResult = await shipProduct(senderAddress, ...payloads);
      break;

    case 'receiveProduct':
      transactionResult = await receiveProduct(senderAddress, ...payloads);
      break;

    default:
      throw new Error('Method name not exist');
  }

  return transactionResult;
};

module.exports = { isValidTransaction, executeTransaction };

/**
 * Retrieve sender address from tx
 * @param {*} tx transaction
 * @returns sender address - no hex prefix
 */
function getSenderAddress(tx) {
  const { txParams, ecdsaSignature } = tx;

  // creat msgHash
  const jsonTxParam = JSON.stringify(txParams);
  const msgHash = util.hashPersonalMessage(Buffer.from(jsonTxParam));

  // get v,s,r, from sig
  let { v, r, s } = ecdsaSignature;

  // recover public key and sender address
  const recoveredPublicKey = util.ecrecover(msgHash, v, r, s);
  const senderAddress = util.publicToAddress(recoveredPublicKey);

  return senderAddress.toString('hex');
}
