const jwt = require('jsonwebtoken');

const generateAccessToken = ( payload ) => {
  const token = jwt.sign( payload, 'OHMYSECRET', {expiresIn: '7d'} )
  return token
};

const verifyToken = (accessToken) => {
  return jwt.verify(accessToken, 'OHMYSECRET');
};

module.exports = {
  generateAccessToken,
  verifyToken,
};
