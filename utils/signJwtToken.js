const jwt = require("jsonwebtoken");

const signJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = signJwtToken;
