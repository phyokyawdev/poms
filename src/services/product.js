const { productTrie } = require('../db');
/*
 * PRODUCT
 * - enroll product
 * - ship and receive product
 * - get current owner
 * - get recipient
 * - get product status
 * - strip hex prefix inside here
 */

/**
 * Enroll product to state
 * @param {*} manufacturerAddress message sender's address
 * @param {*} productCode product code to be enrolled
 */
const enrollProduct = async (manufacturerAddress, productCode) => {
  const productInfo = {
    owner: manufacturerAddress,
    status: 'owned'
  };

  await productTrie.put(productCode, productInfo);
};

/**
 * Called when product is just left from current owner
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
  const { owner, status } = productInfo;

  if (status === 'owned' && owner === senderAddress) {
    productInfo.recipient = recipientAccountAddress;
    productInfo.status = 'shipped';

    await productTrie.put(productCode, productInfo);
  }
};

/**
 * Invoked by new owner who received a product
 * @param {*} senderAddress message sender's address
 * @param {*} productCode product code to be received
 */
const receiveProduct = async (senderAddress, productCode) => {
  const productInfo = await productTrie.get(productCode);
  if (productInfo.recipient === senderAddress) {
    productInfo.owner = senderAddress;
    productInfo.status = 'owned';

    await productTrie.put(productCode, productInfo);
  }
};

const getCurrentOwner = async (productCode) => {
  const productInfo = await productTrie.get(productCode);
  return productInfo.owner;
};

module.exports = {
  enrollProduct,
  shipProduct,
  receiveProduct,
  getCurrentOwner
};
