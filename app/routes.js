var express     = require('express');

// Import controllers
// var beerController  = require('./controllers/beer');

// Set router for app

module.exports = function(app) {
  var router = express.Router();

  // Route to controller
  /**
   * router.route('/beers')
   * .post(authController.isAuthenticated, beerController.postBeers)
   * .get(authController.isAuthenticated, beerController.getBeers);
   */

  // Register all our routes with /api
  app.use('/api', router);
}
