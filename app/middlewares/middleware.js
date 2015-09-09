var helper           = require('../../lib/helper');
var Error400         = require('../../lib/errors/error400');
var Error401         = require('../../lib/errors/error401');
var ApiErrors        = require('../../lib/apiError');
var jwt              = require('jsonwebtoken');
var config           = require('../../config/config');

var authenticate = function(req, res, next) {
  // Check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // Decode token
  if (token) {
    // Verify secret and check expiration
    jwt.verify(token, config.jwt.secretKey, function(err, decoded) {
      if (err) {
        return next(new Error401(401, 'Invalid token'));
      } else {
        // If everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // If there is no token
    // Return 401 error
      return next(new Error401(401, 'No token provided'));
  }
}

var createToken = function(obj, secretKey, expiration) {

  // If parameter is null
  // Set the value in the config file
  var secretKey = typeof secretKey !== 'undefined'
                    ? secretKey : config.jwt.secretKey;

  var expiration = typeof expiration !== 'undefined'
                    ? expiration : config.jwt.expiresInMinutes;

  return jwt.sign(obj, secretKey, { expiresInMinutes: expiration });

}

function validateID(req, res, next) {
  for (var param in req.params) {
    if (String(param).indexOf("id") > -1) {
      if (!helper.isValidObjectId(req.params[param])) {
        return next(new Error400(
          ApiErrors.INVALID_ID.code,
          ApiErrors.INVALID_ID.msg
        ));
      }
    }
  }
  next();
}

// Validate body request for put, post medthod

function validateBody(req, res, next) {
  if ((req.method === 'PUT') || (req.method === 'POST')) {
    var urls = req.originalUrl.split('/');
    var resource = (req.method === 'PUT') ? urls[urls.length - 2] : urls[urls.length - 1];
    // Remove 's' character: ex: products => product
    resource = resource.slice(0, -1);
    if (!req.body || !req.body[resource]) {
      return next(new Error400(
        ApiErrors.RESOURCE_NOT_FOUND_REQ.code,
        ApiErrors.RESOURCE_NOT_FOUND_REQ.msg
      ));
    }
  }
  next();
}

// user itself or isAdmin
function authorized(req, res, next) {
  //user itself: req.decoded._id = req.params.id
  var user = req.decoded;
  if ((user.is_admin) ||
      (req.params.id && (req.params.id == user._id))) {
    next();
  } else {
    return next(new Error401());
  }
}

module.exports = {
  authenticate : authenticate,
  createToken  : createToken,
  validateID: validateID,
  validateBody: validateBody,
  authorized: authorized
}
