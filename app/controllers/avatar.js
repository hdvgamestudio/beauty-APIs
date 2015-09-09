var multer     = require('../middlewares/multer')
var User       = require('../models/user')
var Image      = require('../models/image')
var config     = require('../../config/config')
var ApiErrors  = require('../../lib/apiError');
var Error400   = require('../../lib/errors/error400');
var gm         = require('gm');

var relativePath = '/upload/avatar/'
var upload = multer(config.static_dir + relativePath).single('avatar')

exports.postAvatars = function(req, res, next) {
  var userId = req.params.id;
	upload(req, res, function(err) {
		if (err) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				return next(new Error400(
					ApiErrors.FILE_TOO_LARGE.code,
					ApiErrors.FILE_TOO_LARGE.msg
				));
			}
			return next(err);
		}
		var imageUrl = relativePath + req.file.filename;
    gm(config.static_dir + imageUrl).size(function(err, dimension) {
      if (err) return next(err);
      var image = new Image({
        origin: {
          height: dimension.height,
          width: dimension.width,
          url: imageUrl,
        },
        type: 'avatar'
      });
      image.save(function(err, savedImage) {
        if (err) next(err)
        User.findOne({ _id: userId })
          .exec(function(err, user) {
            if (err) return next(err);
            user.avatar = savedImage._id;
            user.save(function(err, savedUser) {
              if (err) return next(err);
              res.json({
                user_id: savedUser._id,
                avatar_id: savedUser.avatar,
								avatar_url: imageUrl
              });
            });
        });
      });
    });
	})
}

exports.getAvatars = function(req, res, next) {
  var userId = req.params.id;
  var size = 'origin';
  if (req.query.size) {
    size = size + ' ' + req.query.size;
  }
  User.findOne({ _id: userId }, { _id: 1, avatar: 1 })
    .populate('avatar', size)
    .exec(function(err, user) {
      if (err) return next(err);
			if (!user) res.json({});
			else res.json(user);
  });
};
