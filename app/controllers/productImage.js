var multer     = require('../middlewares/multer')
var Product    = require('../models/product')
var Image      = require('../models/image')
var config     = require('../../config/config')
var ApiErrors  = require('../../lib/apiError');
var Error400   = require('../../lib/errors/error400');
var gm         = require('gm');

var relativePath = '/upload/product/'
var upload = multer(config.static_dir + relativePath).single('productImage')

exports.postImages = function(req, res, next) {
  var productId = req.params.id;
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
        type: 'product'
      });
      image.save(function(err, savedImage) {
        if (err) next(err)
        Product.findOne({ _id: productId })
          .exec(function(err, product) {
            if (err) return next(err);
            product.image = savedImage._id;
            product.save(function(err, savedProduct) {
              if (err) return next(err);
              res.json({
                product_id: savedProduct._id,
                image_id: savedProduct.image,
                image_url: imageUrl
              });
            });
        });
      });
    });
  })
}

exports.getImages = function(req, res, next) {
  var productId = req.params.id;
  var size = 'origin';
  if (req.query.size) {
    size = size + ' ' + req.query.size;
  }
  Product.findOne({ _id: productId }, { _id: 1, image: 1 })
    .populate('image', size)
    .exec(function(err, product) {
      if (err) return next(err);
      if (!product) res.json({});
      else res.json(product);
  });
};
