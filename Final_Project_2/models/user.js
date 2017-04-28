var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');

var userSchema = mongoose.Schema({
  username : {
    type : String,
    index : true
  },
  password : {
    type : String
  }
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createNewUser = function (newUser, callback) {
  bcryptjs.genSalt(10, function(err, salt) {
    bcryptjs.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.getUser = function (username, callback) {
  User.findOne({username : username}, callback);
}

module.exports.getUserId = function(userID, callback) {
  User.findById(userID, callback);
}

module.exports.confirmPassword = function(input, hash, callback) {
  bcryptjs.compare(input, hash, function(err, res) {
    if (err) {
      throw err;
    } else {
      callback(null, res);
    }
  });
}