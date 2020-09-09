const passport = require("passport");
const { Strategy } = require("passport-local");
const mongoose = require("mongoose");
const debug = require("debug")("app:local.strategy");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: "username",
      },
      (username, password, done) => {
        //Match user
        User.findOne({ username: username })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "User is not registered" });
            }

            //Match password
            //Hash password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password incorrect" });
              }
            });
          })
          .catch((err) => debug(err));
      }
    )
  );
  //store user in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //retrieve user from session
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      if (err) throw err;
      done(null, user);
    });
  });
};
