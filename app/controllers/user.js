var User = require('../models/user');

exports.postUsers = function(req, res, next) {
  var user = new User({
    name: req.body.name,
    password: req.body.password
  });

  user.save(function(err, data) {
    if (err) {
      return next(new Error());
    }

    res.json({message: 'User had been created sucessfully!', user: data});
  });
}
