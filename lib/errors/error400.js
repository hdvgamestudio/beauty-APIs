function Error400(code, message) {
  Error.call(this, typeof message === "undefined" ? undefined : message);
  Error.captureStackTrace(this, this.constructor);
  this.name = "BadRequestError";
  this.message = typeof message === "undefined" ? "Bad Request Error" : message;
  this.code = typeof code === "undefined" ? "400" : code;
  this.status = 400;
  //this.inner = error;
}

Error400.prototype = Object.create(Error.prototype);
Error400.prototype.constructor = Error400;

module.exports = Error400;
