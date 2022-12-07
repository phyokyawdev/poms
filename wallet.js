const ethWallet = require("ethereumjs-wallet");

const addressData = ethWallet.default.generate();
console.log(`Private key = ${addressData.getPrivateKeyString()}`);
console.log(`Address = ${addressData.getAddressString()}`);

/**
 * no practical use for public key,
 * so it is omitted.
 */
