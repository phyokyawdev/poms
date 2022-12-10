const util = require('@ethereumjs/util');
const account = require('./account');
const transaction = require('./transaction');

const acc = account.create();
const txParams = { one: 'one' };

// create transaction
const tx = transaction.create(acc.privateKey, txParams);
const { v, r, s } = tx.ecdsaSignature;

// recovered address from signature
// txParams: {} -> msgHash: Buffer
const jsonTxParam = JSON.stringify(txParams);
const msgHash = util.hashPersonalMessage(Buffer.from(jsonTxParam));
const recoveredPublicKey = util.ecrecover(msgHash, v, r, s);
const recoveredAddress = util.addHexPrefix(
  util.publicToAddress(recoveredPublicKey).toString('hex')
);

// test results
console.log('real', acc.address);
console.log('reco', recoveredAddress);
console.log(
  'recovered address from signature is same as real address ',
  acc.address === recoveredAddress
);
