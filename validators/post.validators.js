const { body, param } = require("express-validator");

const validators = {};

validators.idInParams = [
  param("id")
    .notEmpty().withMessage("Id field is required")
    .isMongoId().withMessage("Id must be mongo id")
]

validators.createValidator = [
  body("title")
    .notEmpty().withMessage("Title field is required")
    .trim()
    .isLength({ min: 8, max: 32 }).withMessage("Title length must be between 8 and 32 chars"),
  body("description")
    .notEmpty().withMessage("Description field is required")
    .trim()
    .isLength({ min: 8}).withMessage("Description length must be min 8 chars"),
  body("image")
    .notEmpty().withMessage("Image field is required")
    .isURL().withMessage("Image must be an URL")
];

validators.updateValidator = [
  body("title")
    .trim()
    .isLength({ min: 8, max: 32 }).withMessage("Title length must be between 8 and 32 chars"),
  body("description")
    .trim()
    .isLength({ min: 8}).withMessage("Description length must be min 8 chars"),
  body("image")
    .isURL().withMessage("Image must be an URL")
]

validators.addCommentValidator = [
  body("description")
    .notEmpty().withMessage("Description field is required")
    .trim()
    .isLength({ min: 8}).withMessage("Description length must be min 8 chars"),
]

module.exports = validators;