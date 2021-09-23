const express = require("express");
const StaticRouter = express.Router();
const path = require("path");
const debug = require("debug")("app:StaticRoutes");
let Job = require("../models/JobModel");
const authUser = require('./auth');

function router(nav) {
  StaticRouter.get("/", (req, res) => {
    Job.find({}, (err, jobs) => {
      if (err) throw err;
      res.render("index", { nav, jobs });
    }).sort({ entryDate: -1 });
  });
  StaticRouter.get("/search", (req, res) => {
    const { jobTitle, jobRegion } = req.query;
    Job.find({ jobTitle }, (err, joblist) => {
      if (err) throw err;
      let jobs = [];
      for (let job of joblist) {
        if (job.jobRegion == jobRegion) {
          jobs.push(job);
        }
        if (jobRegion == "Anywhere") {
          jobs.push(job);
        }
      }
      res.render("search", { nav, jobs }); 
    }).sort({ entryDate: -1 });
  });
  StaticRouter.get("/about", (req, res) => {
    res.render("about", { nav });
  });
  StaticRouter.get("/contact", (req, res) => {
    res.render("contact", { nav });
  });
  StaticRouter.get("/faq", (req, res) => {
    res.render("faq", { nav });
  });

  StaticRouter.route("/:id").get(authUser, (req, res) => {
    const { id } = req.params;
    Job.findOne({ _id: id }, (err, job) => {
      if (err) throw err;
      debug(job);
      res.render("preview", { nav, job });
    });
  });

  return StaticRouter;
}

module.exports = router;
