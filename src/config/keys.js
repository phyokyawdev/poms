const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

/**
 * CHECK CLIENT OPTIONS
 */
const { port = 3000, nodeType, mainAddress } = argv;

if (!nodeType) throw new Error('--nodeType is required');

const lower_type = nodeType.toLowerCase();

if (lower_type !== 'main' && lower_type !== 'side')
  throw new Error('--nodeType accept main or side as argument');

if (lower_type === 'side' && !mainAddress)
  throw new Error('--mainAddress is required for --nodeType side');

module.exports = {
  port,
  nodeType: lower_type,
  mainAddress
};
