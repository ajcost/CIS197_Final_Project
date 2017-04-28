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

server.get('/data', function (req, res) {
    mongoose.find().toArray(function (err, data) {
        //set id property for all records
        for (var i = 0; i < data.length; i++)
            data[i].id = data[i]._id;
        //output response
        res.send(data);
    });
});

server.post('/data', function(req, res){
  var data = req.body;
  var mode = data["!nativeeditor_status"];
  var sid = data.id;
  var tid = sid;

  delete data.id;
  delete data.gr_id;
  delete data["!nativeeditor_status"];


  function update_response(err, result){
    if (err)
      mode = "error";
    else if (mode == "inserted")
      tid = data._id;

    res.setHeader("Content-Type","text/xml");
    res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
  }

  if (mode == "updated")
    mongoose.updateById( sid, data, update_response);
  else if (mode == "inserted")
    mongoose.insert(data, update_response);
  else if (mode == "deleted")
    mongoose.removeById( sid, update_response);
  else
    res.send("Not supported operation");
});

// Set Port
server.set('port', (process.env.PORT || 8080));

server.listen(server.get('port'), function () {
  console.log('Server hosting on port 8080');
});