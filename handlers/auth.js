const db = require('../models');
const jwt = require('jsonwebtoken');

exports.signup = async function(req, res, next) {
  try {
    let user = await db.User.create(req.body);
    let {id, username, profileImage} = user;
    let token = jwt.sign(
      {
        id,
        username,
        profileImage
      },
      process.env.SECRET_KEY
    );
    return res.status(200).json({
      id,
      username,
      profileImage,
      token
    });
  } catch (err) {
    //if validation fails
    if(err.code === 11000) {
      err.message = 'Sorry, that username and/or email has been already taken'
    }
    return next({
      status: 400,
      message: err.message
    })
  }
};

exports.signin = async function(req, res, next) {
  try {
    let user = await db.User.findOne({
      email: req.body.email
    });
    let { id, username, profileImage } = user;
    let isMatched = await user.comparePassword(req.body.password);
    if (isMatched) {
      let token = jwt.sign(
        {
          id,
          username,
          profileImage
        },
        process.env.SECRET_KEY
      );
      return res.status(200).json({
        id,
        username,
        profileImage,
        token
      });
    } else {
      return next({
        status: 400,
        message: "Invalid Email/Password"
      });
    }
  } catch (err) {
      return next({
        status: 400,
        message: "Invalid Email/Password"
      });
  }
}
