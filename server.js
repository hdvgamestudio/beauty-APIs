
/**
 * Module dependencies
 */

var express            = require('express');
var mongoose           = require('mongoose');
var bodyParser         = require('body-parser');
var morgan             = require('morgan');
var errorHandler       = require('./lib/errors/errorHandler');
var config             = require('./config/config');

var app = express();
var port = process.env.PORT || 3000;

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Use morgan to log requests to the console
app.use(morgan('dev'));

// Use the body-parser to parse the body of a request
app.use(bodyParser.urlencoded({
  extended: true
}));

// Set up secret key for app
// app.set('superSecret', config.secretKey);

// Set router for app
require('./app/routes')(app);

// Set error handler for whole app
errorHandler(app);

app.listen(port);
console.log('Express app started on port ' + port);
