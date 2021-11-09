const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || "Secret";
const expTime = process.env.JWT_EXPTIME || "14d";

const tools = {};

tools.createToken = (_id) => {
  const payload = {
    _id: _id
  };

  return jwt.sign(payload, secret, {
    expiresIn: expTime,
  })
}

tools.verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return false;
  }
}

module.exports = tools;