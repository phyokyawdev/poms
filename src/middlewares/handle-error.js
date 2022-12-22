const log = require('debug')('info:app error handler');
function handleError(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.expose) {
    return res.status(err.status).send({ error: err.message });
  }

  log(err);
  res.status(500).send({ error: 'Something went wrong' });
}

module.exports = handleError;
