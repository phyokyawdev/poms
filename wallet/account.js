const ethWallet = require('ethereumjs-wallet');

const create = () => {
  const addressData = ethWallet.default.generate();

  /**
   * Private Key
   * - 32 bytes
   * - represented by 64 hex characters
   */
  const privateKey = addressData.getPrivateKeyString();

  /**
   * Address
   * - 20 bytes
   * - represented by 40 hex characters
   */
  const address = addressData.getAddressString();

  /**
   * Public Key
   * - no practical use for public key, so it is omitted.
   */
  return {
    privateKey,
    address
  };
};

module.exports = { create };
