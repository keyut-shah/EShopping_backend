
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateRandomToken() {
  return crypto.randomBytes(20).toString('hex');
}

function generateJWTToken(user, secretKey, expiresIn) {
    console.log("generate jwt token method call")
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email
    },
    secretKey,
    { expiresIn }
  );
}

function verifyJWTToken(token, secretKey) {
    console.log("verify jwt token method call")
  return jwt.verify(token, secretKey);
}

module.exports = {
  generateRandomToken,
  generateJWTToken,
  verifyJWTToken
};
