const { accountTrie } = require('./src/db');
const util = require('@ethereumjs/util');

accountTrie.root = Buffer.from(
  '8caa5b7bb119dbc31ace24affce3b049f5514efabe487503ee76e215c27d1f79',
  'hex'
);

accountTrie.get('one').then(console.log);

// const isHex = util.isHexString('0x12345');
// console.log(isHex);
// const obj = new Proxy(accountTrie, {
//   get: function (target, name, receiver) {
//     if (name === 'root') return util.bufferToHex(target[name]);
//     return Reflect.get(target, name, receiver);
//   },
//   set: function (target, name, value, receiver) {
//     if (name === 'root') {
//       // change value to buffer if not
//       let changedVal = value;
//       if (!Buffer.isBuffer(value)) {
//         changedVal = Buffer.from(util.stripHexPrefix(value), 'hex');
//       }
//       return (target[name] = changedVal);
//     }
//     return Reflect.set(target, name, changedVal, receiver);
//   }
// });
// class sth {
//   bla = 'some';

//   get root() {
//     return this.bla + ' 1';
//   }
// }

// const b = new sth();
// console.log(typeof b.root, b.root);
// // getter and setter are not considered as function;
