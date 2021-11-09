const express = require("express");
const router =  express.Router();

const runValidation = require("@app/validators");
const { loginValidator, registerValidator } = require("@app/validators/user.validators");

const authController = require("@app/controllers/auth.controller");

router.post("/signin", loginValidator, runValidation, authController.login);
router.post("/signup", registerValidator, runValidation, authController.register);

module.exports = router;