const express = require("express");
require("express-async-errors");
const createHttpError = require("http-errors");
const { handleError } = require("./middlewares");
const nodeRouter = require("./routes/nodes");
const transactionRouter = require("./routes/transactions");
const blockRouter = require("./routes/blocks");

const app = express();

// parse request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routers
app.use("/nodes", nodeRouter);
app.use("/transactions", transactionRouter);
app.use("/blocks", blockRouter);

// unknown routes handler
app.all("*", async (req, res, next) => {
  next(createHttpError(404, "Route not exist"));
});

// error handler
app.use(handleError);

module.exports = app;
