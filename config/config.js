
/**
 * Module dependencies.
 */

var path = require('path');
var extend = require('util')._extend;

var development = require('./env/development');
var test = require('./env/test');
var production = require('./env/production');

var defaults = {
  apiPath: '/api/v1',
  info: {
    name: 'beauty-APIs',
    version: '1.0.0'
  },
  root: path.normalize(__dirname + '/..'),
  static_dir: path.normalize(__dirname + '/../app/public'),
  jwt: {
    secretKey: '123456',
    expiresInMinutes: 1440 // Expires in 24 hours
  }
};

/**
 * Expose
 */

module.exports = {
  development: extend(development, defaults),
  test: extend(test, defaults),
  production: extend(production, defaults)
}[process.env.NODE_ENV || 'development'];
