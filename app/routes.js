var express             = require('express');
var config              = require('../config/config');
var Error404            = require('../lib/errors/error404');
var jwtAuth             = require('../lib/jwtAuth');
var userController      = require('./controllers/user');
var authController      = require('./controllers/auth');

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
    .get(jwtAuth.authenticate, userController.getUsers)
    .post(userController.postUsers);

  // Register all our routes with /api/v
  app.use(config.apiPath, router);

  // All other requests redirect to 404
  app.all("*", function (req, res, next) {
    next(new Error404());
  });
}
