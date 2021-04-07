const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const {checkSession} = require('./handlers');

const indexRouter = require('./routes/index');

const app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(checkSession);

app.use('/', indexRouter);


module.exports = app;
