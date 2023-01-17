const log = require('debug')('info:manufacturer service');
const { manufacturerTrie } = require('../db');
const keys = require('../config/keys');

/**
 * Enroll manufacturer's information to state
 * - only admin is allowed
 * @param {*} senderAddress
 * @param {*} manufacturerAddress address of manufacturer to be enrolled
 * @param {*} companyPrefix company prefix inside product code
 * @param {*} companyName name of product company
 */
const enrollManufacturer = async (
  senderAddress,
  manufacturerAddress,
  companyPrefix,
  companyName
) => {
  // isAdmin?
  if (senderAddress !== keys.mainAccountAddress)
    throw new Error('only admin can enroll manufacturer');

  // is manufacturer already exist
  const existingManufacturer = await manufacturerTrie.get(manufacturerAddress);
  if (existingManufacturer) throw new Error('existing manufacturer');

  // address => manufacturerInfo
  const manufacturerInfo = { manufacturerAddress, companyPrefix, companyName };
  await manufacturerTrie.put(manufacturerAddress, manufacturerInfo);

  // uint40 => address
  await manufacturerTrie.put(companyPrefix, manufacturerAddress);

  log(
    `enrolled manufacturer, manufacturer trie root: ${manufacturerTrie.root}`
  );

  return manufacturerInfo;
};

/**
 * Check if sender is valid manufacturer for product code
 * @param {*} senderAddress
 * @param {*} productCode
 * @returns boolean
 */
const checkAuthorShip = async (senderAddress, productCode) => {
  if (!productCode) return false;
  const manufacturerAddress = await getManufacturerAddress(productCode);
  if (manufacturerAddress === senderAddress) return true;
  return false;
};

module.exports = { enrollManufacturer, checkAuthorShip };

/**
 * Get manufacturer address from productCode
 * @param {*} productCode
 */
async function getManufacturerAddress(productCode) {
  const companyPrefix = getCompanyPrefix(productCode);
  const manufacturerAddress = await manufacturerTrie.get(companyPrefix);
  return manufacturerAddress;
}

/**
 * Retrieve company prefix from productCode
 * @param {*} productCode
 * @returns
 */
function getCompanyPrefix(productCode) {
  const firstSix = String(productCode).slice(0, 6);
  return firstSix;
}
