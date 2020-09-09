const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    author: {type: String, required: true},
    email: {type: String, required: true},
    jobTitle: {type: String, required: true},
    location: {type: String, required: true},
    jobRegion: {type: String, required: true},
    jobType: {type: String, required: true},
    gender: {type: String},
    jobDescription: {type: String, required: true},
    jobResponsibilities: {type: String, required: true},
    jobExperience: {type: String},
    companyName: {type: String, required: true},
    companySalary: {type: String},
    companyWebsite: {type: String},
    companyWebsiteFacebook: {type: String},
    companyWebsiteTwitter: {type: String},
    companyWebsiteLinkedin: {type: String},
    entryDate: {type: Date, default: Date.now},
    deadlineDate: {type: String, required: true},
})

let Job = mongoose.model('Job', jobSchema);

module.exports = Job;