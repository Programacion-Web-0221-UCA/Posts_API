const express = require("express");
const router =  express.Router();

const runValidation = require("@app/validators");
const { loginValidator, registerValidator } = require("@app/validators/user.validators");
const { authRequired, roleValidatorHelper } = require("@app/middlewares/auth.middlewares");
const { ROLES } = require("@app/constants");

const authController = require("@app/controllers/auth.controller");

router.post("/signin", loginValidator, runValidation, authController.login);

router.use(authRequired);
router.use(roleValidatorHelper(ROLES.SUPERADMIN));

router.post("/signup", registerValidator, runValidation, authController.register);

module.exports = router;