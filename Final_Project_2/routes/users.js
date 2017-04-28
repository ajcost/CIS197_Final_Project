var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// Login Page
router.get('/login', function (req, res) {
  res.render('login');
});

// Register Page
router.get('/register', function (req, res) {
  res.render('register');
});

// Register Page
router.post('/register', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var confirmpassword = req.body.confirmpassword;

  var newUser = new User({username : username, password : password});
  User.createNewUser(newUser, function (err, user) {
    if (err) {
      throw err;
    }
  });

  res.redirect('/users/login');
});

router.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login'}),
  function(req, res) {
    res.redirect('/');
  });

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUser(username, function (err, user) {
      if (err) { 
        return done(err); 
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      User.confirmPassword(password, user.password, function (err, res) {
        if (err) {
          throw err;
        } 
        else if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect Password.' });
        }

      });
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserId(id, function(err, user) {
    done(err, user);
  });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/users/login');
});

module.exports = router;