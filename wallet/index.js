/**
 * Monkey patch BigInt
 */
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const repl = require('node:repl');
const cli = repl.start({ replMode: repl.REPL_MODE_STRICT });
const account = require('./account');
const transaction = require('./transaction');
const network = require('./network');

cli.context.account = account;
cli.context.transaction = transaction;
cli.context.network = network;

/**
 * PRIVATE KEYS
 */
const adminPrivateKey =
  '0x42149995a69d74dc9cdef715a9e0d2149a25fa3e0841094d61b1783ed1f21cca';
const manufacturerPrivateKey =
  '0x78cafb987e3b90cecadd70af6d8b065d194d9de9ba4b7b39a5ca046019762138';
const userOnePrivateKey =
  '0x14fdeaa1a09aaa91349f6b8d8e24a6316b2870dca52babf86060a8b69d1b0bf2';
const userTwoPrivateKey =
  '0x4f407984f742eca3f6e0a97d24bd8a7f02216b9b1616d3ca8a03459de4adc730';

/**
 * ADDRESSES
 */
const adminAddress = '0x8727edbea1b1622dee260ce3d05835efe3a3701d';
const manufacturerAddress = '0x237d68165c86db2f394ef7b6a8708ae85a4be3ba';
const userOneAddress = '0x2eb36426bb9a5b4ba8c2b620d0402999549d6b2c';
const userTwoAddress = '0x2c623c2965c2800cfc220899d16227487dff5841';

/**
 * PAYLOAD DATA
 */
const companyPrefix = '123456';
const productCode = '123456789101';

cli.context.enrollManufacturerTx = transaction.create(adminPrivateKey, {
  methodName: 'enrollManufacturer',
  payloads: [manufacturerAddress, companyPrefix, 'Company One']
});

cli.context.enrollProductTx = transaction.create(manufacturerPrivateKey, {
  methodName: 'enrollProduct',
  payloads: [productCode]
});

/**
 * Ship from manufacturer to user one
 */
cli.context.shipProductManufacturerToUserOneTx = transaction.create(
  manufacturerPrivateKey,
  {
    methodName: 'shipProduct',
    payloads: [userOneAddress, productCode]
  }
);

/**
 * Receive product by user one
 */
cli.context.receiveProductByUserOneTx = transaction.create(userOnePrivateKey, {
  methodName: 'receiveProduct',
  payloads: [productCode]
});

/**
 * Ship from user one to user two
 */
cli.context.shipProductUserOneToUserTwoTx = transaction.create(
  userOnePrivateKey,
  {
    methodName: 'shipProduct',
    payloads: [userTwoAddress, productCode]
  }
);

/**
 * Receive product by user two
 */
cli.context.receiveProductByUserTwoTx = transaction.create(userTwoPrivateKey, {
  methodName: 'receiveProduct',
  payloads: [productCode]
});

/**
 * Create enrollManufacturerTx for better reusability
 */
cli.context.createEnrollManufacturerTx = (
  manufacturerAddress,
  companyPrefix
) => {
  const tx = transaction.create(adminPrivateKey, {
    methodName: 'enrollManufacturer',
    payloads: [manufacturerAddress, companyPrefix, 'Example Company']
  });

  return tx;
};

/**
 * DISPLY OF CONSOLE
 */
console.log('WALLET REPL');
console.log('  ===========');
console.log('available modules');

console.log('- account');
console.log('- transaction');
console.log('- network');

console.log('');
