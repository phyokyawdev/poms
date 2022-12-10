const repl = require('repl');
const cli = repl.start({ replMode: repl.REPL_MODE_STRICT });
cli.context.account = require('./account');
cli.context.transaction = require('./transaction');
cli.context.network = require('./network');

console.log('WALLET REPL');
console.log('  ===========');
console.log('available modules');

console.log('- account');
console.log('- transaction');
console.log('- network');

console.log('');
