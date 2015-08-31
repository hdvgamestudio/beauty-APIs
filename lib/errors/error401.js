function Error401(code, message) {
  Error.call(this, typeof message === "undefined" ? undefined : message);
  Error.captureStackTrace(this, this.constructor);
  this.name = "UnauthorizedAccessError";
  this.message = typeof message === "undefined" ? "Unauthorized" : message;
  this.code = typeof code === "undefined" ? "401" : code;
  this.status = 401;
  //this.inner = error;
}

Error401.prototype = Object.create(Error.prototype);
Error401.prototype.constructor = Error401;

module.exports = Error401;
