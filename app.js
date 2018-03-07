var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const v = require('node-input-validator');

var expressSession = require('express-session');
var flash1 = require('express-flash-messages');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var Sequelize = require('sequelize');
var mysql = require('mysql2');

// This is an example of connecting to database with express-myconnection & mysql.
/*

//var connection = require('express-myconnection');
//var mysql2 = require('mysql');

app.use(
        connection(mysql,{
            host: 'localhost',
            user: 'root',
            password:'root',
            port: '6000',
            database: 'users'
        }, 'request')
);
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Flash messages
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator()); // Add this after the bodyParser middlewares!

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'max', saveUninitialized: true, resave: true}));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
