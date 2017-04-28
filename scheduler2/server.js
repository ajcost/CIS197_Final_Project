var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

mongoose.connect('mongodb://localhost/scheduler2')
var db = mongoose.connect;

//create express app, use public folder for static files
var server = express();
server.use(express.static(path.join(__dirname, 'public')));

//is necessary for parsing POST request
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use(cookieParser());

server.get('/init', function(req, res) {
  res.send("Scheduler Database Initilized");
});

// Set Port
server.set('port', (process.env.PORT || 8080));

server.listen(server.get('port'), function () {
  console.log('Server hosting on port 8080');
});