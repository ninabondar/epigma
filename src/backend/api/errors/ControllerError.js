module.exports = class ControllerError extends Error {

  constructor(msg, status, controller) {
    super(msg);
    this.name = 'Controller Error';
    (this.parent) ? this.message = this.parent.sqlMessag : this.message = msg; // TODO MOONDO ERROR
    this.status = status || 500;
    this.controller = controller;
    Error.captureStackTrace(this, this.constructor);
  }

};
