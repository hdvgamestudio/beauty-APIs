// error handler for all the applications

module.exports = function(app) {
  app.use(function (err, req, res, next) {
    var http_code = 500,
        message = typeof err.message !== "undefined"
                    ? err.message : "Internal Server Error",
        msg = { message: message };

    switch (err.name) {
      case "UnauthorizedError":
      case "BadRequestError":
      case "UnauthorizedAccessError":
      case "NotFoundError":
      case "ResourceConflict":
        http_code = err.status;
        msg = { code: err.code, message: err.message };
        break;
      default:
        break;
    }

    return res.status(http_code).json(msg);

  });
}

