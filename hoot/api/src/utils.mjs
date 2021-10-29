import { validationResult, matchedData } from 'express-validator';
import { ValidationFailure } from './errors.mjs';

const validate = (req) => {
  try {
    validationResult(req).throw();
  } catch (e) {
    throw new ValidationFailure(e.mapped());
  }

  return matchedData(req);
};

const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

export {
  validate,
  delay,
};
