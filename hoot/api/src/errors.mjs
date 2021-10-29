/* eslint-disable max-classes-per-file */

class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status;
    this.payload = { message };
  }
}

class ValidationFailure extends AppError {
  constructor(errors) {
    super('');
    this.payload = { errors };
  }
}

export {
  AppError, ValidationFailure,
};
