const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    profileImage: {
      type: String
    },
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }],
    bio: {
      type: String
    },
    website: {
      type: String
    },
    location: {
      type: String
    }
  },
  {
    timestamps: true
  });

userSchema.pre('save', async function(next){
  try {
    if (!this.isModified('password')) {
      return next();
    }
    let hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function(inputedPassword, next) {
  try {
    let isMatched = await bcrypt.compare(inputedPassword, this.password);
    return isMatched;
  } catch (err) {
    return next(err);
  }
}

module.exports = mongoose.model('User', userSchema)
