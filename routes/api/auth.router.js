const express = require("express");
const router =  express.Router();

const runValidation = require("@app/validators");
const { loginValidator } = require("@app/validators/user.validators");

const authController = require("@app/controllers/auth.controller");

router.post("/signin", loginValidator, runValidation, authController.login);

module.exports = router;