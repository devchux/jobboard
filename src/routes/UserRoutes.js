const express = require("express");
const debug = require("debug")("app:UserRoutes");
const User = require("../models/UserModel");
let Job = require("../models/jobModel");
const bcrypt = require("bcryptjs");
const UserRoutes = express.Router();
const passport = require("passport");
const authUser = require('./auth');

function router(nav) {
  UserRoutes.route("/signup")
    .get((req, res) => {
      res.render("signup", { nav });
    })
    .post((req, res) => {
      const { username, password, password2 } = req.body;
      let errors = [];

      if (!username || !password || !password2) {
        errors.push({ msg: "Fill in all fields" });
      }
      if (password !== password2) {
        errors.push({ msg: "Passwords do not match" });
      }
      if (password.length < 8) {
        errors.push({ msg: "Password is less than 8 characters" });
      }
      if (errors.length > 0) {
        res.render("signup", {
          nav,
          errors,
          username,
          password,
          password2,
        });
      } else {
        User.findOne({ username: username }).then((user) => {
          if (user) {
            errors.push({ msg: "Username already exist" });
            res.render("signup", {
              nav,
              errors,
              username,
              password,
              password2,
              user
            });
          } else {
            const newUser = new User({
              username,
              password,
            });
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, function (err, hash) {
                // Store hash in your password DB.
                if (err) throw err;
                newUser.password = hash;
                //save user
                newUser.save().then((user) => {
                  req.flash(
                    "success_msg",
                    `You are now registered and can log in as ${user.username}`
                  );
                  res.redirect("/users/login");
                });
              });
            });
          }
        });
      }
    });

  UserRoutes.route("/login")
    .get((req, res) => {
      res.render("login", { nav });
    })
    .post((req, res, next) => {
      passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true,
      })(req, res, next);
    });

  UserRoutes.route("/post-job")
    .get(authUser, (req, res) => {
      debug(req.user);
      res.render("post-job", { nav, user: req.user });
    })
    .post((req, res) => {
      const {
        author,
        email,
        jobTitle,
        location,
        jobRegion,
        jobType,
        gender,
        jobDescription,
        jobResponsibilities,
        jobExperience,
        companyName,
        companySalary,
        companyWebsite,
        companyWebsiteFacebook,
        companyWebsiteTwitter,
        companyWebsiteLinkedin,
        deadlineDate,
      } = req.body;

      const newJob = new Job({
        author,
        email,
        jobTitle,
        location,
        jobRegion,
        jobType,
        gender,
        jobDescription,
        jobResponsibilities,
        jobExperience,
        companyName,
        companySalary,
        companyWebsite,
        companyWebsiteFacebook,
        companyWebsiteTwitter,
        companyWebsiteLinkedin,
        deadlineDate,
      });

      newJob.save().then((job) => {
        req.flash(
          "success_msg",
          `You successfully created an entry for the post of ${job.jobTitle}`
        );
        res.redirect('/');
      });
    });

  UserRoutes.route("/profile").get(authUser, (req, res) => {
    res.send(req.user);
  });

  UserRoutes.route("/logout").get(authUser, (req, res) => {
    req.flash(
      "success_msg",
      'You successfully logged out'
    );
    req.logout();
  });

  return UserRoutes;
}

module.exports = router;
