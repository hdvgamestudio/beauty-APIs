var express                       = require('express');
var config                        = require('../config/config');
var Error404                      = require('../lib/errors/error404');
var jwtAuth                       = require('../lib/jwtAuth');
var validateID                    = require('./middlewares/middleware').validateID;
var authorized                    = require('./middlewares/middleware').authorized;
var authenticate                  = require('./middlewares/middleware').authenticate;
var validateBody                  = require('./middlewares/middleware').validateBody;
var multer                        = require('./middlewares/multer')
var userController                = require('./controllers/user');
var authController                = require('./controllers/auth');
var productController             = require('./controllers/product');
var commentController             = require('./controllers/comment');
var likeController                = require('./controllers/like');
var tagController                 = require('./controllers/tag');
var replyController               = require('./controllers/reply');
var replyLikeController           = require('./controllers/replyLike');
var rateController                = require('./controllers/rate');
var shopController                = require('./controllers/shop');
var distributorController         = require('./controllers/distributor');
var classificationController      = require('./controllers/classification');
var classProductController        = require('./controllers/classificationProduct');
var avatarController              = require('./controllers/avatar');
var productImageController        = require('./controllers/productImage');

// Set router for app
module.exports = function(app) {
  var router = express.Router();

  // Route to controllers
  /*--- Index ---*/
  router.route('/')
    .get(function(req, res) {
      res.send('Hello! The beauty-APIs');
    });

  /*--- Authenticate ---*/
  router.route('/authenticate')
    .post(authController.postAuthenticate);

  /*--- User ---*/
  router.route('/users')
    .get(authenticate, userController.getUsers)
    .post(validateBody, userController.postUsers);

  router.route('/users/:id')
    .get(validateID, userController.showUsers)
    .put(authenticate, authorized, validateID, validateBody, userController.editUsers)
    .delete(authenticate, authorized, validateID, userController.deleteUsers)

  /*--- Product ---*/
  router.route('/products')
    .get(authenticate, productController.getProducts)
    .post(validateBody, productController.postProducts);
  router.route('/products/:id')
    .get(validateID, productController.showProducts)
    .put(validateID, validateBody, productController.editProducts)
    .delete(validateID, productController.deleteProducts)

  /*--- Comment ---*/
  router.route('/products/:id/comments')
    .post(validateID, validateBody, commentController.postComments)
    .get(validateID, commentController.getComments)
  router.route('/products/:product_id/comments/:comment_id')
    .get(validateID, commentController.showComments)
    .put(validateID, validateBody, commentController.editComments)
    .delete(validateID, commentController.deleteComments)

  /*--- Like ---*/
  router.route('/products/:product_id/comments/:comment_id/likes')
    .post(validateID, validateBody, likeController.postLikes)
    .get(validateID, likeController.getLikes)

  /*--- Tag ---*/
  router.route('/tags')
    .get(tagController.getTags)
    .post(validateBody, tagController.postTags);

  /*--- Like ---*/
  router.route('/products/:product_id/comments/:comment_id/likes')
    .post(validateID, validateBody, likeController.postLikes)
    .get(validateID, likeController.getLikes)

  /*-- Reply --*/
  router.route('/products/:product_id/comments/:comment_id/replies')
    .post(validateID, replyController.postReplies)
    .get(validateID, replyController.getReplies);
  router.route('/products/:product_id/comments/:comment_id/replies/:reply_id')
    .put(validateID, replyController.editReplies)
    .delete(validateID, replyController.deleteReplies);

  /*--- LikeReply ---*/
  router.route('/products/:product_id/comments/:comment_id/replies/:reply_id/likes')
    .post(validateID, validateBody, replyLikeController.postLikes)
    .get(validateID, replyLikeController.getLikes)

  /*--- Rate ---*/
  router.route('/products/:id/rates')
    .post(validateID, rateController.postRates)
    .get(validateID, rateController.getRates)
    .post(validateBody, tagController.postTags);

  /*--- Shop ---*/
  router.route('/shops')
    .get(shopController.getShops)
    .post(validateBody, shopController.postShops);

  router.route('/shops/:id')
    .put(validateBody,shopController.editShops)
    .delete(shopController.deleteShops);

  /*---- Distributor ----*/
  router.route('/distributors')
    .get(distributorController.getDistributors)
    .post(validateBody, distributorController.postDistributors);

  router.route('/distributors/:id')
    .put(validateBody, distributorController.editDistributors)
    .delete(distributorController.deleteDistributors);

  /*--- Classification ---*/
  router.route('/classifications')
    .post(classificationController.postClassifications)
    .get(classificationController.getClassifications)
  router.route('/classifications/:id')
    .put(classificationController.editClassifications)
    .get(classificationController.showClassifications)
    .delete(classificationController.deleteClassifications)

  router.route('/classifications/:id/products')
    .get(classProductController.getProducts)

  /*--- Upload avatar ---*/
  router.route('/users/:id/avatars')
    .post(avatarController.postAvatars)
    .get(avatarController.getAvatars)

  /*--- Upload product image---*/
  router.route('/products/:id/images')
    .post(productImageController.postImages)
    .get(productImageController.getImages)

  // Register all our routes with /api/v
  app.use(config.apiPath, router);

  // All other requests redirect to 404
  app.all("*", function (req, res, next) {
    next(new Error404());
  });
}
