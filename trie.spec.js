const { accountTrie } = require('./src/db');
const util = require('@ethereumjs/util');

let stateRoot = '';

const test = async () => {
  console.log('empty root: ', util.KECCAK256_RLP_S.toString('hex'));

  console.log('root: ', accountTrie.root);
  await accountTrie.put('one', { result: 'four' });
  await accountTrie.put('two', { result: 'three' });

  const one = await accountTrie.get('one');
  const two = await accountTrie.get('two');

  //const errorKeyPut = await accountTrie.put(null, 'true val');
  //const errorValuePut = await accountTrie.put('trueKey', undefined);
  const errorRetrieve = await accountTrie.get('three');

  console.log('result one: ', one);
  console.log('result two: ', two);
  console.log('errorRetrieve: ', errorRetrieve);
  console.log('root: ', accountTrie.root);

  // changed root
  accountTrie.root =
    '0xbf7f7c700efe42b2299c4d887512251e935af93b16c6f056db30253053be16bb';
  console.log('root changed: ', accountTrie.root);
};

test().catch((err) => {
  console.log(err);
  process.exit(1);
});
