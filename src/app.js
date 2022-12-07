const express = require("express");
require("express-async-errors");
const createHttpError = require("http-errors");
const blockchainRouter = require("./routes/blockchain");
const transactionRouter = require("./routes/transactions");
const { handleError } = require("./middlewares");

const app = express();

// parse request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// blockchain network routes
app.use("/blockchain", blockchainRouter);
app.use("/transactions", transactionRouter);

// unknown routes handler
app.all("*", async (req, res, next) => {
  next(createHttpError(404, "Route not exist"));
});

// error handler
app.use(handleError);

module.exports = app;
