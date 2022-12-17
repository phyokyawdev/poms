const util = require('@ethereumjs/util');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

/**
 * CHECK CLIENT OPTIONS
 */
let { port = 3000, nodeType, mainIpAddress, mainAccountAddress } = argv;

if (!nodeType) throw new Error('--nodeType is required');

const lower_type = nodeType.toLowerCase();

if (lower_type !== 'main' && lower_type !== 'side')
  throw new Error('--nodeType accept main or side as argument');

if (lower_type === 'main' && !mainAccountAddress)
  throw new Error('--mainAccountAddress is required for --nodeType main');

if (lower_type === 'side' && !mainIpAddress)
  throw new Error('--mainIpAddress is required for --nodeType side');

//strip hex prefix for mainAccountAddress
mainAccountAddress = util.stripHexPrefix(mainAccountAddress);

module.exports = {
  port,
  nodeType: lower_type,
  mainAccountAddress,
  mainIpAddress
};
