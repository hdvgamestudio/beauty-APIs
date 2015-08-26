var Error400         = require('../../lib/errors/error400');
var ApiErrors        = require('../../lib/apiError');
var User             = require('../models/user');
var jwt              = require('../../lib/jwtAuth');
var _                = require('underscore');


exports.postUsers = function(req, res, next) {

  // Validate parameters request
  if (!req.body || !req.body.user) {
    return next(new Error400(
			ApiErrors.USER_NOT_FOUND_REQ.code,
			ApiErrors.USER_NOT_FOUND_REQ.msg
		));
  }
	var newUser = req.body.user;
  var user;
  if (!newUser.account_type) {
    return next(new Error400(
			ApiErrors.ACCOUNT_TYPE_REQUIRED.code,
			ApiErrors.ACCOUNT_TYPE_REQUIRED.msg
		));
  }

  switch (newUser.account_type) {
    case "internal":
			// Check if username and email existed
		  if (!newUser.name)
				return next(new Error400(
					ApiErrors.USERNAME_REQUIRED.code,
					ApiErrors.USERNAME_REQUIRED.msg
				));

		  if (!newUser.password)
				return next(new Error400(
					ApiErrors.PWD_REQUIRED.code,
					ApiErrors.PWD_REQUIRED.msg
				));

			User.findOne({
				name: newUser.name
			}, function(err, user) {
				if (err) return next(new Error(err.message));
				if (user)
				  return next(new Error400(
						ApiErrors.USERNAME_EXISTED.code,
						ApiErrors.USERNAME_EXISTED.msg
					));

			  // Check if email existed
				if (newUser.email) {
					User.findOne({
						email: newUser.email
					}, function(err, user) {
						if (err) return next(new Error(err.message));
						if (user)
							return next(new Error400(
								ApiErrors.EMAIL_EXISTED.code,
								ApiErrors.EMAIL_EXISTED.msg
							));

						user = new User(newUser);
						saveNewUser(res, user, next);
					});
				} else {
					user = new User(newUser);
					saveNewUser(res, user, next);
        }
			});
      break;

    case "facebook":
			if (!newUser.uuid)
				return (next (new Error400(
					ApiErrors.FACEBOOKID_REQUIRED.code,
					ApiErrors.FACEBOOKID_REQUIRED.msg
				)));

			// Check if uuid of facebook is existed
			User.findOne({
				social_accounts:{
					$elemMatch: {
						account_type: "facebook",
				    uuid: newUser.uuid
					}
				}
			}, function(err, user) {
				if (err) return next(new Error(err.message));
				// Not yet existed, then save DB and retrun access_token
				if (!user) {
					newUser.account_type = "facebook";
					user = new User({
						social_accounts: [newUser]
					});
					saveNewUser(res, user, next);
				} else {
					// Existed, return access_token
					var accessToken = jwt.createToken(user);
					res.json({
						success: true,
						user_id: user._id,
						access_token: accessToken
					});
				}
			});
      break;

    default:
      return next(new Error400(
				ApiErrors.INVALID_ACCOUNT_TYPE.code,
				ApiErrors.INVALID_ACCOUNT_TYPE.msg
			));
  }
}

exports.getUsers = function(req, res, next) {
  var criteria = {}
  // Search query criteria
  if (req.query.q) {
    var expr = new RegExp('.*' + req.query.q + '.*');
    criteria.$or = [
      {name: expr},
      {mail: expr},
      {address: expr},
      {genre: expr}
    ];
  }
  // Filter by genre
  if (req.query.genre) {
    criteria.genre = req.query.genre;
  }
  User.find(criteria)
    .exec(function(err, users) {
      if (err) {
        return next(new Error(err.message));
      }
      res.json(users);
  })
}

exports.showUser = function(req, res, next) {
  User.findOne({ "_id": req.params.id })
    .exec(function(err, user) {
       if (err) {
         return next(new Error(err.message));
       }
       res.json(user);
  });
}

exports.editUser = function(req, res, next) {
  var updatedUser = req.body.user;
  User.findOne({"_id": req.params.id})
    .exec(function(err, user) {
      if (err) return next(new Error(err.message));

      user = _.extend(user, updatedUser);
      user.save(function(err, savedUser) {
        if (err) return next(new Error(err.message));
        res.json(user);
      });
    })
}


function saveNewUser(res, user, next) {
	user.save(function(err, savedUser) {
		if (err) return next(new Error(err.message));
		var accessToken = jwt.createToken(savedUser);
		res.json({
			success: true,
			user_id: savedUser._id,
			access_token: accessToken
		});
	});
}
