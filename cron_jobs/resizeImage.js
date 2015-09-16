var gm       = require('gm');
var fs       = require('fs');
var mongoose = require('mongoose');
var path     = require('path');
var async    = require('async');
var Image    = require('../app/models/image');
var config   = require('../config/config');
var util     = require('../lib/utils');

mongoose.connect('mongodb://localhost:27017/beauty');

var SIZES = {
  tiny:   { height: 100, width: 100, dir: 'tiny_100X100', name: 'tiny'},
  small:  { height: 200, width: 200, dir: 'small_200X200', name: 'small' },
  medium: { height: 300, width: 300, dir: 'medium_300X300', name: 'medium' },
  large:  { height: 400, width: 400, dir: 'large_400X400', name: 'large' },
  huge:   { height: 500, width: 500, dir: 'huge_500X500', name: 'huge' }
};

var logFileName = 'resizeImage_{0}.txt'.format((new Date()).yyyymmdd());
var logFile = path.join(config.log_dir, logFileName);

function createDirectories() {
  var dir;
  var types = ['avatar', 'product'];
  var len = types.length
  for(var i = 0; i < len; i++) {
    for(var size in SIZES) {
      dir = path.join(config.upload_dir, types[i], SIZES[size].dir);
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
    }
  }
};

function resizeImageJob() {
  createDirectories();
  Image.find({ is_processed: false })
    .exec(function(err, images) {
      var len = images.length;
      var sourceUrl, destinationUrl, destinationDir;
      async.forEachLimit(images, 100, function(image, callback) {
        console.log('resizing.................');
        sourceUrl = getOriginalPath(image);
        async.forEach(SIZES, function(size, childCallback) {
          if (image[size.name]) {
            destinationUrl = getNewPath(image, size);
            resizeImage(image, sourceUrl, destinationUrl, size, childCallback);
          }
        }, function(err) {
          if (err) {
            console.log("error resize image");
            return callback(err);
          }
          image.is_processed = true;
          image.save(function(err, result) {
            if (err) return callback(err);
            callback();
          });
        })
      }, function(err) {
        if (err) console.log("error while resizing all images");
        mongoose.connection.close();
        console.log("finish resizing all images")
      });
  })
};

function getOriginalPath(image) {
  return path.join(config.upload_dir, image.origin.url);
}

function getNewPath(image, size) {
  var arr = image.origin.url.split('/');
  var fileName = arr[arr.length - 1];
  return path.join(config.upload_dir, image['type'], size.dir, fileName);
}

function resizeImage(image, source, destination, size, callback) {
  gm(source)
    .resize(size.width, size.height)
    .write(destination, function (err) {
      var re = new RegExp(config.upload_dir, 'g');
      var logMsg = '\n' + image._id + ' ' + source.replace(re, '')
        + ' '+ destination.replace(re, '');
      if (err) {
        logMsg = logMsg + '\n' + err + '\n';
        return callback(err);
      };
      image[size.name] = {
        height: size.height,
        width: size.width,
        url: destination.replace(re, '')
      }
      fs.appendFile(logFile, logMsg, function (err) {});
      callback();
  });
}

module.exports = resizeImageJob;
