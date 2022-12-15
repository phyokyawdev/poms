const { manufacturerTrie } = require('../db');

/*
 * MANUFACTURER
 * - enroll manufacturer
 * - check authorship
 * - strip hex prefix inside here
 */

let currentRoot = '';

/**
 * Enroll manufacturer's information to state
 * @param {*} manufacturerAddress address of manufacturer to be enrolled
 * @param {*} companyPrefix company prefix inside product code
 * @param {*} companyName name of product company
 */
const enrollManufacturer = async (
  manufacturerAddress,
  companyPrefix,
  companyName
) => {
  // address => manufacturerInfo
  const manufacturerInfo = { companyPrefix, companyName };
  await manufacturerTrie.put(manufacturerAddress, manufacturerInfo);

  // uint40 => address
  await manufacturerTrie.put(companyPrefix, manufacturerAddress);
};

/**
 *
 * @param {*} senderAddress
 * @param {*} productCode
 * @returns
 */
const checkAuthorShip = async (senderAddress, productCode) => {
  const manufacturerAddress = await getManufacturerAddress(productCode);
  if (manufacturerAddress === senderAddress) return true;
  return false;
};

/**
 * Private methods
 * ===============
 */

/**
 * Get manufacturer address from productCode
 * @param {*} productCode
 */
const getManufacturerAddress = async (productCode) => {
  const companyPrefix = getCompanyPrefix(productCode);
  const manufacturerAddress = await manufacturerTrie.get(companyPrefix);
  return manufacturerAddress;
};

/**
 * Retrieve company prefix from productCode
 * @param {*} productCode
 * @returns
 */
const getCompanyPrefix = (productCode) => {
  return false;
};

module.exports = { enrollManufacturer, checkAuthorShip };
