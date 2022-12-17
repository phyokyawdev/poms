const log = require('debug')('info:manufacturer service');
const { manufacturerTrie } = require('../db');
const { mainAccountAddress } = require('../config/keys');

/*
 * MANUFACTURER
 * - enroll manufacturer
 * - check authorship
 * - strip hex prefix inside here
 */

let currentRoot = '';

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
  if (senderAddress !== mainAccountAddress) return;

  // address => manufacturerInfo
  const manufacturerInfo = { companyPrefix, companyName };
  await manufacturerTrie.put(manufacturerAddress, manufacturerInfo);

  // uint40 => address
  await manufacturerTrie.put(companyPrefix, manufacturerAddress);

  log(`manufacturer trie root changed: ${manufacturerTrie.root}`);
};

/**
 * Check if sender is valid manufacturer for product code
 * @param {*} senderAddress
 * @param {*} productCode
 * @returns boolean
 */
const checkAuthorShip = async (senderAddress, productCode) => {
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
  return false;
}
