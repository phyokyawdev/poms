const { accountTrie } = require('./src/db');
const util = require('@ethereumjs/util');

accountTrie.root = Buffer.from(
  '8caa5b7bb119dbc31ace24affce3b049f5514efabe487503ee76e215c27d1f79',
  'hex'
);

accountTrie.get('one').then(console.log);
