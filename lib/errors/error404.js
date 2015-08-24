function Error404(code, message) {
    Error.call(this, typeof message === "undefined" ? undefined : message);
    Error.captureStackTrace(this, this.constructor);
    this.name = "NotFoundError";
    this.message = typeof message === "undefined" ? "Not Found Error" : message;
    this.code = typeof code === "undefined" ? "404" : code;
    this.status = 404;
    //this.inner = error;
}

Error404.prototype = Object.create(Error.prototype);
Error404.prototype.constructor = Error404;

module.exports = Error404;
