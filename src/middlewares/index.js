const handleError = require('./handle-error');
const allowMainNode = require('./allow-main-node');
const allowSideNode = require('./allow-side-node');
const isThisMain = require('./is-this-main');
const isThisSide = require('./is-this-side');
const parseRequestBlock = require('./parse-request-block');
const parseRequestTx = require('./parse-request-tx');

module.exports = {
  handleError,
  allowMainNode,
  allowSideNode,
  isThisMain,
  isThisSide,
  parseRequestBlock,
  parseRequestTx
};
