// Require All Database Modules | Connect to Database
var mongodb = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/scheduler');
var db = mongoose.connect;

// Require Passport Modules
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Require parsers
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// Require All Express Modules and Dependencies
var express = require('express');
var session = require('express-session');
var handlebars = require('express-handlebars');
var validator = require('express-validator');

// Require Path Module: Helpful for working with file and directory paths
var path = require('path');

//Require routes
var routes = require('./routes/index');
var users = require('./routes/users');

//Initialize
var server = express();
server.set('views', path.join(__dirname, 'views'));
server.engine('handlebars', handlebars({defaultLayout: 'layout'}));
server.set('view engine', 'handlebars');

server.use(express.static(path.join(__dirname, 'public')));

server.use(session({
  secret : 'secret',
  saveUninitialized : true,
  resave : true
}));

// Set Middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use(cookieParser());

server.use(passport.initialize());
server.use(passport.session());

server.use(validator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Global Vars
server.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

server.use('/', routes);
server.use('/users', users);

// Set Port
server.set('port', (process.env.PORT || 8080));

server.listen(server.get('port'), function () {
  console.log('Server hosting on port 8080');
});