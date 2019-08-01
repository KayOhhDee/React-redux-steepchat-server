const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/steepchat", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

module.exports.User = require('./user');
module.exports.Message = require('./message');
module.exports.Likes = require('./likes');
module.exports.Comment = require('./comments');
module.exports.Notification = require('./notifications');