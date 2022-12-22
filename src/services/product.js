const log = require('debug')('info:product service');
const { productTrie } = require('../db');
const { checkAuthorShip } = require('./manufacturer');

/**
 * Enroll product to state
 * - only valid manufacturer is allowed
 * @param {*} senderAddress message sender's address (manufacturer)
 * @param {*} productCode product code to be enrolled
 */
const enrollProduct = async (senderAddress, productCode) => {
  // isValidManufacturer?
  const isValidManufacturer = await checkAuthorShip(senderAddress, productCode);
  if (!isValidManufacturer) throw new Error('Invalid manufacturer');

  const productInfo = {
    productCode,
    owner: senderAddress,
    status: 'owned'
  };

  await productTrie.put(productCode, productInfo);

  log(`enrolled product, product trie root: ${productTrie.root}`);

  return productInfo;
};

/**
 * Called when product is just left from current owner
 * - only owner is allowed
 * @param {*} senderAddress message sender's address
 * @param {*} recipientAccountAddress product receiver's address
 * @param {*} productCode product code to be shipped
 */
const shipProduct = async (
  senderAddress,
  recipientAccountAddress,
  productCode
) => {
  const productInfo = await productTrie.get(productCode);
  if (!productInfo) throw new Error('product not exist');

  const { owner, status } = productInfo;

  // isOwner?
  if (status === 'owned' && owner === senderAddress) {
    productInfo.recipient = recipientAccountAddress;
    productInfo.status = 'shipped';

    await productTrie.put(productCode, productInfo);
    log(`shipped product, product trie root: ${productTrie.root}`);
  }

  return productInfo;
};

/**
 * Invoked by new owner who received a product
 * - only recipient is allowed
 * @param {*} senderAddress message sender's address
 * @param {*} productCode product code to be received
 */
const receiveProduct = async (senderAddress, productCode) => {
  const productInfo = await productTrie.get(productCode);
  if (!productInfo) throw new Error('product not exist');

  const { recipient, status } = productInfo;

  // isRecipient?
  if (status === 'shipped' && recipient === senderAddress) {
    productInfo.owner = senderAddress;
    productInfo.status = 'owned';

    await productTrie.put(productCode, productInfo);
    log(`received product, product trie root: ${productTrie.root}`);
  }

  return productInfo;
};

module.exports = {
  enrollProduct,
  shipProduct,
  receiveProduct
};
