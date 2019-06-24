const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/steepchat", {
  useNewUrlParser: true,
  useCreateIndex: true
});

module.exports.User = require('./user');