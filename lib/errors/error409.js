function Error409(code, message) {
  Error.call(this, typeof error === "undefined" ? undefined : message);
  Error.captureStackTrace(this, this.constructor);
  this.name = "ResourceConflict";
  this.message = typeof message === "undefined" ? "Resource Conflict" : message;
  this.code = typeof code === "undefined" ? "409" : code;
  this.status = 409;
  //this.inner = error;
}

Error409.prototype = Object.create(Error.prototype);
Error409.prototype.constructor = Error409;

module.exports = Error409;
