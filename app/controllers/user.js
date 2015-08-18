var User = require('../models/user');


exports.postUsers = function(req, res, next) {
  var user = new User({
    name: req.body.name,
    password: req.body.password
  });

  user.save(function(err, data) {
    if (err) {
      return next(new Error(err.message));
    }

    res.json({success: true, user: data});
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
