const util = require('@ethereumjs/util');
const { enrollManufacturer, checkAuthorShip } = require('./manufacturer');
const { enrollProduct, shipProduct, receiveProduct } = require('./product');

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
      const isValidManufacturer = await checkAuthorShip(
        senderAddress,
        ...payloads
      );
      if (!isValidManufacturer) throw new Error('Invalid manufacturer');
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

/**
 * parse tx data or throw error
 * @param {*} tx
 * @returns parsed tx
 */
const parseTransaction = (tx) => {
  const { txParams, ecdsaSignature } = tx;

  if (!(txParams && txParams.methodName && txParams.payloads))
    throw new Error('txParams is missing some keys');

  if (
    !(
      ecdsaSignature &&
      ecdsaSignature.v &&
      ecdsaSignature.r &&
      ecdsaSignature.s
    )
  )
    throw new Error('ecdsaSignature is missing some keys');

  let { v, r, s } = ecdsaSignature;
  try {
    v = BigInt(v);
    r = Buffer.from(r);
    s = Buffer.from(s);
  } catch (error) {
    throw new Error('Error parsing signature');
  }

  if (!util.isValidSignature(v, r, s)) throw new Error('Invalid signature');

  tx.ecdsaSignature = { v, r, s };
  return tx;
};

module.exports = { executeTransaction, parseTransaction };

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
