const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/steepchat', {
  keepAlive: true,
  useMongoClient: true
})