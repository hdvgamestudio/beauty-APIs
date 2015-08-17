// error handler for all the applications

module.exports = function(app) {
  app.use(function (err, req, res, next) {

    var code = 500,
        msg = { message: "Internal Server Error" };

    switch (err.name) {
      case "UnauthorizedError":
        code = err.status;
        msg = undefined;
        break;
      case "BadRequestError":
      case "UnauthorizedAccessError":
      case "NotFoundError":
        code = err.status;
        msg = { message: err.message };
        break;
      default:
        break;
    }

    return res.status(code).json(msg);

  });
}

