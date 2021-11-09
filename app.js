var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const database = require("@app/config/mongoose.config");
const mainRouter = require("@app/routes");
const { errorHandler } = require("@app/middlewares/handler.middlewares");

var app = express();

database.connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", mainRouter);
app.use(errorHandler);

module.exports = app;
