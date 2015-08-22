var Error400         = require('../../lib/errors/error400');
var ApiMessages      = require('../../lib/apiMessage');
var User             = require('../models/user');
var validate         = require('jsonschema').validate
var jwt              = require('../../lib/jwtAuth');


exports.postUsers = function(req, res, next) {

  // Validate parameters request
	var postUser = req.body.user;
  console.log(postUser);
	var validatedUser = validateAccount(postUser);
  if (!validatedUser.success) {
    console.log(validatedUser.error.message);
    return next(new Error400(
          validatedUser.error.code,
          validatedUser.error.message)
        );
  }

  // If request is valid
  var user = validatedUser.user;

  user.save(function(err, savedUser) {
		console.log(savedUser);
    if (err) {
      return next(new Error(err.message));
    }
		var accessToken = jwt.createToken(savedUser);
    res.json({
			success: true,
			user_id: savedUser._id,
			access_token: accessToken
		});
  });
}

exports.getUsers = function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      return next(new Error());
    }

    res.json(users);
  });
}

var UserFacebookSchema = {
	"type": "object",
	"properties": {
		"name": {"type": "string"},
		"email": {"type": "string"},
		"uid": {"type": "string"},
		"access_token": {"type": "string"},
		"account_type": {"type": "string"},
		"oss_attributes": [
			{"device_token": {"type": "string"},
			  "type": {"type": "string"}
			}
		]
	},
	"required": ["uid"]

}

// Internal account
function validateAccount(user) {
	console.log(user.account_type);
	switch (user.account_type) {
		case "facebook":
			validation = validate(user, UserFacebookSchema);
			if (validation.errors.length != 0) {
				return {
					success: false,
				 	error: {code: 0, message: "User validation failed"}
				}
			} else {
				var userFb = new User({
					name: user.name,
					email: user.email,
					accounts: [{
						account_type: "facebook",
					  uid: user.uid,
					  access_token: user.access_token,
            oss_attributes: user.oss_attributes
					}]
				});
				return { success: true, user: userFb };
			}
		default:
			return { success: false };
	}

}
