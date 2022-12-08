const repl = require('repl');
const cli = repl.start({ replMode: repl.REPL_MODE_STRICT });
cli.context.account = require('./account');

console.log('WALLET REPL');
console.log('  ===========');
console.log('available modules');

console.log('- account');

console.log('');
