const crypto = require('crypto');
/**
 * BLOCK
 * - (hash)
 * - nonce
 * - timestamp
 * - previous block hash
 * - height
 * - product trie root
 * - manufacturer trie root
 * - tx
 */
class Block {
  /**
   * Dynamic properties
   */
  blockHash = '';
  nonce = 0;

  timestamp;

  /**
   * The following properties must
   * be provided to mine method
   */
  previousBlockHash;
  height;
  productTrieRoot;
  manufacturerTrieRoot;
  tx;

  constructor(obj) {
    obj && Object.assign(this, obj);
  }

  mine(
    previousBlockHash,
    height,
    productTrieRoot,
    manufacturerTrieRoot,
    tx,
    difficulty
  ) {
    this.timestamp = new Date().getTime();
    this.previousBlockHash = previousBlockHash;
    this.height = height;
    this.productTrieRoot = productTrieRoot;
    this.manufacturerTrieRoot = manufacturerTrieRoot;
    this.tx = tx;

    // start pow with provided difficulty
    while (!this._isSolved(difficulty)) {
      this.nonce++;
      this.blockHash = this._calculateHash();
    }

    return this;
  }

  /**
   * Verify existing block via
   * PoW verification with difficulty
   * @param {*} difficulty
   * @returns boolean
   */
  verify(difficulty) {
    if (!this.validate()) return false;

    if (!this._isSolved(difficulty)) return false;

    const calculatedBlockHash = this._calculateHash();
    if (this.blockHash !== calculatedBlockHash) return false;

    return true;
  }

  validate() {
    if (this.height === 0) return true;

    if (
      !(
        this.blockHash &&
        this.nonce &&
        this.timestamp &&
        this.previousBlockHash &&
        this.height &&
        this.productTrieRoot &&
        this.manufacturerTrieRoot &&
        this.tx
      )
    )
      return false;

    return true;
  }

  /**
   * check if PoW is solved
   * @param {*} difficulty number of leading "0"
   * @returns boolean
   */
  _isSolved(difficulty) {
    return (
      this.blockHash.substring(0, difficulty) ===
      Array(difficulty + 1).join('0')
    );
  }

  /**
   * calculate hash with block properties
   * @returns hex string
   */
  _calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.nonce +
          this.timestamp +
          this.previousBlockHash +
          this.height +
          this.manufacturerTrieRoot +
          this.productTrieRoot +
          JSON.stringify(this.tx)
      )
      .digest('hex');
  }
}

module.exports = Block;
