var express             = require('express');
var config              = require('../config/config');
var userController      = require('./controllers/user');
var NotFoundError       = require('./errors/notFoundError');

// Import controllers
// var beerController  = require('./controllers/beer');

// Set router for app

module.exports = function(app) {
  var router = express.Router();

  // Route to controllers
  /*=== Index ===*/
  router.route('/')
    .get(function(req, res){
      res.send('Hello! The beauty-APIs');
    });

  /*=== User ===*/
  router.route('/users')
    .post(userController.postUsers);

  // Register all our routes with /api/v
  app.use(config.apiPath, router);

  // All other requests redirect to 404
  app.all("*", function (req, res, next) {
    next(new NotFoundError());
  });
}
