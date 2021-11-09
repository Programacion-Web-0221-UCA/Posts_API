const { body } = require('express-validator');
const { REGEXP } = require('@app/constants');

const validators = {};

validators.registerValidator = [
  body("username")
    .notEmpty().withMessage("username field is required")
    .isLength({min: 4, max: 32}).withMessage("username field must be between 8 and 32 characters"),
  body("password")
    .notEmpty().withMessage("password field is required")
    .isLength({ min: 8, max:32}).withMessage("password field must be between 8 and 32 characters")
    .matches(REGEXP.PASSWORD).withMessage("password field must have at least one uppercase, one lowercase and one number"),
  body("email")
    .notEmpty().withMessage("email field is required")
    .isEmail().withMessage("email field must have standard format")
];

validators.loginValidator = [
  body("username")
    .notEmpty().withMessage("username field is required"),
  body("password")
    .notEmpty().withMessage("password field is required")
]

module.exports = validators;