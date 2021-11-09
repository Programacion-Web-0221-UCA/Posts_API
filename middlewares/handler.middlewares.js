const debug = require('debug')("app:error");

const middlewares = {};

middlewares.errorHandler = (error, req, res, next) => {
  debug(error);
  return res.status(500).json({ error: "Internal Server Error"});
}

module.exports  = middlewares;