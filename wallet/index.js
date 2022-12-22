/**
 * Monkey patch BigInt
 */
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const repl = require('repl');
const cli = repl.start({ replMode: repl.REPL_MODE_STRICT });
const account = require('./account');
const transaction = require('./transaction');
const network = require('./network');

cli.context.account = account;
cli.context.transaction = transaction;
cli.context.network = network;

console.log('WALLET REPL');
console.log('  ===========');
console.log('available modules');

console.log('- account');
console.log('- transaction');
console.log('- network');

console.log('');

cli.context.enrollManufacturerTx = transaction.create(
  '0x42149995a69d74dc9cdef715a9e0d2149a25fa3e0841094d61b1783ed1f21cca',
  {
    methodName: 'enrollManufacturer',
    payloads: [
      '0x237d68165c86db2f394ef7b6a8708ae85a4be3ba',
      123456789101,
      'Company One'
    ]
  }
);
