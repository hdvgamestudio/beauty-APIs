var jwt                        = require('jsonwebtoken');
var config                     = require('../config/config');
var UnauthorizedAccessError    = require('./errors/unauthorizedAccessError');

var authenticate = function(req, res, next) {
  // Check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // Decode token
  if (token) {
    // Verify secret and check expiration
    jwt.verify(token, config.jwt.secretKey, function(err, decoded) {
      if (err) {
        return next(new UnauthorizedAccessError('Invalid token'));
      } else {
        // If everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // If there is no token
    // Return 401 error
      return next(new UnauthorizedAccessError('No token provided'));
  }
}

var createToken = function(obj, secretKey, expiration) {

  // If parameter is null
  // Set the value in the config file
  var secretKey = typeof secretKey !== 'undefined'
                    ? secretKey : config.jwt.secretKey;

  var expiration = typeof expiration !== 'undefined'
                    ? expiration : config.jwt.expiresInMinutes;

  return jwt.sign(obj, secretKey,
      { expiresInMinutes: expiration });

}

module.exports = {
  authenticate : authenticate,
  createToken  : createToken
}
