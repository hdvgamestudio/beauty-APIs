var multer       = require('multer');
var config       = require('../../config/config');
var Error400     = require('../../lib/errors/error400');
var ApiErrors    = require('../../lib/apiError');

// Max file size is 3mb
var MAX_SIZE_FILE = 3

module.exports = function(uploadDir) {

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now()
        + '.' + file.mimetype.split('/')[1])
    }
  })

  var fileFilter = function(req, file, cb) {
    // Valid mimetypes
    var mimetypes = ["image/png", "image/jpg", "image/jpeg"];
    if (mimetypes.indexOf(file.mimetype) > -1) {
      cb(null, true);
    } else {
      cb(new Error400(
        ApiErrors.INVALID_FILE_FORMAT.code,
        ApiErrors.INVALID_FILE_FORMAT.msg
      ));
    }
  }

  return multer({
    storage: storage,
    limits: {
      fileSize: MAX_SIZE_FILE * 1024 * 1024
    },
    fileFilter: fileFilter
  })
}
