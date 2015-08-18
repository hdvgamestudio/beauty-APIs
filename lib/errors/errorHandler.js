// error handler for all the applications

module.exports = function(app) {
  app.use(function (err, req, res, next) {

    var code = 500,
        message = typeof err.message !== "undefined"
                    ? err.message : "Internal Server Error",
        msg = { message: message };

    switch (err.name) {
      case "UnauthorizedError":
        code = err.status;
        msg = undefined;
        break;
      case "BadRequestError":
      case "UnauthorizedAccessError":
      case "NotFoundError":
      case "ResourceConflict":
        code = err.status;
        msg = { message: err.message };
        break;
      default:
        break;
    }

    return res.status(code).json(msg);

  });
}

