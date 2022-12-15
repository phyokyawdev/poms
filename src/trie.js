const { BaseTrie: Trie } = require('merkle-patricia-tree');

const create = (store) => {
  const trie = new Trie(store);
  const tempPut = trie.put;
  const tempGet = trie.get;

  trie.put = function () {
    let transformedKey = arguments[0];
    let transformedVal = arguments[1];

    if (!Buffer.isBuffer(transformedKey)) {
      const parsedKey = JSON.stringify(transformedKey);
      arguments[0] = Buffer.from(parsedKey);
    }

    if (!Buffer.isBuffer(transformedVal)) {
      const parsedVal = JSON.stringify(transformedVal);
      arguments[1] = Buffer.from(parsedVal);
    }

    return tempPut.apply(this, arguments);
  };

  trie.get = function () {
    let transformedKey = arguments[0];

    if (!Buffer.isBuffer(transformedKey)) {
      const parsedKey = JSON.stringify(transformedKey);
      arguments[0] = Buffer.from(parsedKey);
    }

    return tempGet
      .apply(this, arguments)
      .then((res) => JSON.parse(res.toString()));
  };

  return trie;
};

module.exports = { create };
