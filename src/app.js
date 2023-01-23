const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const createHttpError = require('http-errors');
const blockchainRouter = require('./routes/blockchain');
const transactionRouter = require('./routes/transactions');
const networkRouter = require('./routes/network');
const informationRouter = require('./routes/information');
const { handleError } = require('./middlewares');
const actuator = require('express-actuator');

const app = express();

// log request
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'
  )
);

// health check routes - info, metrics, health
app.use(actuator());

// parse request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// blockchain network routes
app.use('/network', networkRouter);
app.use('/blockchain', blockchainRouter);
app.use('/transactions', transactionRouter);
app.use('/information', informationRouter);

// unknown routes handler
app.all('*', async (req, res, next) => {
  next(createHttpError(404, 'Route not exist'));
});

// error handler
app.use(handleError);

module.exports = app;
