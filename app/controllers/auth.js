var User                        = require('../models/user');
var Error401                    = require('../../lib/errors/error401');
var Error400                    = require('../../lib/errors/error400');
var jwtAuth                     = require('../../lib/jwtAuth');


exports.postAuthenticate = function(req, res, next) {

  // Validate user in body request
  if (!req.body || !req.body.user) {
    return next(new Error400(
      ApiErrors.ACCOUNT_NOT_FOUND_REQ.code,
      ApiErrors.ACCOUNT_NOT_FOUND_REQ.msg
    ));
  }
  var loginUser = req.body.user;
  if (!loginUser.account_type) {
    return next(new Error400(
      ApiErrors.ACCOUNT_TYPE_REQUIRED.code,
      ApiErrors.ACCOUNT_TYPE_REQUIRED.msg
    ));
  }

  switch (loginUser.account_type) {
    case "internal":
      if (!loginUser.name)
        return next(new Error400(
          ApiErrors.USERNAME_REQUIRED.code,
          ApiErrors.USERNAME_REQUIRED.msg
        ));

      if (!loginUser.password)
        return next(new Error400(
          ApiErrors.PWD_REQUIRED.code,
          ApiErrors.PWD_REQUIRED.msg
        ));

      // If name and password are valid
      loginInternalUser(res, loginUser, next);
      break;
    case "facebook":
      if (!loginUser.uuid)
        return (next (new Error400(
          ApiErrors.FACEBOOKID_REQUIRED.code,
          ApiErrors.FACEBOOKID_REQUIRED.msg
        )));
      User.findOne({
        social_accounts: {
          $elemMatch: {
            account_type: "facebook",
            uuid: loginUser.uuid
          }
        }
      }, function(err, user) {
        if (err) return next(new Error());
        if (!user) return next(new Error401());

        var token = jwtAuth.createToken(user);
        // Return the information including token as JSON
        res.json({
          success: true,
          user_id: user._id,
          access_token: token
        });

      });
      break;
    default:
      return next(new Error400(
        ApiErrors.INVALID_ACCOUNT_TYPE.code,
        ApiErrors.INVALID_ACCOUNT_TYPE.msg
      ));
  }
}

function loginInternalUser(res, loginUser, next) {
  User.findOne({
    name: loginUser.name
  }, function(err, user) {

    if (err) {
      return next(new Error());
    } else {

      if (!user) return next(new Error401());

      // Check if password matches
      user.comparePassword(loginUser.password,  function(err, isMatch) {

        // If any error or password did not match
        if (err || !isMatch) {
          return next(new Error401());
        }

        // If password matches
        // Create a token
        var token = jwtAuth.createToken(user);
        // Return the information including token as JSON
        res.json({
          success: true,
          user_id: user._id,
          access_token: token
        });
      });
    }
  });
};
