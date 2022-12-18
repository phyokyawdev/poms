const util = require('@ethereumjs/util');
const { program } = require('commander');

/**
 * CHECK CLIENT OPTIONS
 */

program
  .option('-p, --port <number>', 'port number', 3000)
  .requiredOption('-t, --node-type <string>', 'node type - "main" | "side"')
  .requiredOption(
    '-a, --main-account-address <string>',
    'address of main account(hex string)'
  )
  .option('-i, --main-ip-address <string>', 'ip address of main account');

program.parse(process.argv);

const options = program.opts();

let { port, nodeType, mainIpAddress, mainAccountAddress } = options;

if (!nodeType) throw new Error('--node-type is required');

const lower_type = nodeType.toLowerCase();

if (lower_type !== 'main' && lower_type !== 'side')
  throw new Error('--node-type accept main or side as argument');

if (lower_type === 'main' && !mainAccountAddress)
  throw new Error('--main-account-address is required for --node-type main');

if (lower_type === 'side' && !mainIpAddress)
  throw new Error('--main-ip-address is required for --node-type side');

mainAccountAddress = util.stripHexPrefix(mainAccountAddress);

module.exports = {
  port,
  nodeType: lower_type,
  mainAccountAddress,
  mainIpAddress
};
