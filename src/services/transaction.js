const util = require('@ethereumjs/util');
const { mainAccountAddress } = require('../config/keys');
const { enrollManufacturer, checkAuthorShip } = require('./manufacturer');
const { enrollProduct, shipProduct, receiveProduct } = require('./product');

/**
 * Retrieve sender address from tx
 * @param {*} tx transaction
 * @returns sender address
 */
const getSenderAddress = (tx) => {
  const { txParams, ecdsaSignature } = tx;

  // creat msgHash
  const jsonTxParam = JSON.stringify(txParams);
  const msgHash = util.hashPersonalMessage(Buffer.from(jsonTxParam));

  // get v,s,r, from sig
  const { v, r, s } = ecdsaSignature;

  // recover public key and sender address
  const recoveredPublicKey = util.ecrecover(msgHash, v, r, s);
  const senderAddress = util.publicToAddress(recoveredPublicKey);

  return senderAddress;
};

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
  return util.isValidSignature(v, r, s);
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

  // get senderAddress
  const senderAddress = getSenderAddress(tx);

  // get params from txParams
  const { methodName, payloads = [] } = txParams;

  let transactionResult;
  // switch methodName according to txParams;
  switch (methodName) {
    case 'enrollManufacturer':
      if (senderAddress === mainAccountAddress) {
        transactionResult = await enrollManufacturer(...payloads);
      }
      break;

    // case 'checkAuthorShip':
    //   transactionResult = checkAuthorShip(...payloads);
    //   break;

    case 'enrollProduct':
      const isAuthor = await checkAuthorShip(...payloads);
      if (isAuthor) {
        transactionResult = await enrollProduct(...payloads);
      }
      break;

    case 'shipProduct':
      transactionResult = await shipProduct(...payloads);
      break;

    case 'receiveProduct':
      transactionResult = await receiveProduct(...payloads);
      break;

    // case 'getCurrentOwner':
    //   break;

    default:
      throw new Error('Method name not exist');
  }

  return transactionResult;
};

module.exports = { isValidTransaction, executeTransaction };
