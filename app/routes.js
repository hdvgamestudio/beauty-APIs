var express             = require('express');
var config              = require('../config/config');
var Error404            = require('../lib/errors/error404');
var jwtAuth             = require('../lib/jwtAuth');
var validateID          = require('../app/middleware').validateID;
var authorized          = require('../app/middleware').authorized;
var authenticate        = require('../app/middleware').authenticate;
var userController      = require('./controllers/user');
var authController      = require('./controllers/auth');
var tagController				= require('./controllers/tag');

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
    .post(userController.postUsers);

	router.route('/users/:id')
		.get(validateID, userController.showUser)
		.put(authenticate, authorized, validateID, userController.editUser)
	/*--- Tag ---*/
	router.route('/tags')
		.get(tagController.getTags)
		.post(tagController.postTags);
  // Register all our routes with /api/v
  app.use(config.apiPath, router);

  // All other requests redirect to 404
  app.all("*", function (req, res, next) {
    next(new Error404());
  });
}
