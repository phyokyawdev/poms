const express = require('express');
const { manufacturerTrie, productTrie } = require('../db');

const router = express.Router();

router.get('/products/:productCode', async (req, res) => {
  const productCode = req.params.productCode;

  const productInfo = await productTrie.get(productCode);

  res.send(productInfo);
});

router.get('/manufacturers/:companyPrefix', async (req, res) => {
  const companyPrefix = req.params.companyPrefix;

  const manufacturerAddress = await manufacturerTrie.get(companyPrefix);
  const manufacturerInfo = await manufacturerTrie.get(manufacturerAddress);

  res.send(manufacturerInfo);
});

module.exports = router;
