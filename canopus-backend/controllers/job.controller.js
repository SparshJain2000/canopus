const { searchController } = require("../controllers/search.controller");
const { mailController } = require("../controllers/mail.controller");
const {
  validationController,
} = require("../controllers/validation.controller");
require("dotenv").config();
const GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS;
var ua = require("universal-analytics");
var visitor = ua(GOOGLE_ANALYTICS);
const router = require("express").Router(),
  passport = require("passport"),
  middleware = require("../middleware/index"),
  User = require("../models/user.model"),
  Job = require("../models/job.model"),
  Freelance = require("../models/freelance.model"),
  Employer = require("../models/employer.model"),
  savedJob = require("../models/savedJobs.model"),
  savedFreelance = require("../models/savedFreelance.model");


async function createJob(req,employer){
    let author = {};
    author.username = req.user.username;
    author.id = req.user._id;
    author.instituteName = req.user.instituteName;
    author.photo = req.user.logo;
    if(req.body.category === "Job"){
        //set expiry date
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 45);

    let job = new Job({
        title: req.body.title,
        profession: req.body.profession,
        specialization: req.body.specialization,
        superSpecialization: req.body.superSpecialization,
        tag:req.body.tag,
        description: req.body.description,
        address: req.body.address,
        createdAt: new Date(),
        createdBy: req.user.role,
        author : author,
        expireAt: expiry,
        validated: employer.validated,
        extension: 1,
        sponsored: req.body.sponsored,
      });
    return job;
    }
    else if(req.body.category === "Day Job" || req.body.category === "Locum"){

        let freelance = new Freelance({
            title: req.body.title,
            profession: req.body.profession,
            specialization: req.body.specialization,
            superSpecialization: req.body.superSpecialization,
            description: req.body.description,
            address: req.body.address,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            attachedApplicants: req.body.attachedApplicants,
            category: req.body.category,
            createdAt: new Date(),
            createdBy: "Employer",
            expireAt: req.body.endDate,
            validated: employer.validated,
            sponsored: req.body.sponsored,
        });
        return freelance;
    }
    else throw new Error("Invalid Category");
    //  return freelance;
   
}

async function createSavedJob(req,job){

    let sjob = new savedJob({
        jobRef: job._id,
        status: "Active",
        author: job.author,
        title: job.title,
        profession: job.profession,
        specialization: job.specialization,
        superSpecialization: job.superSpecialization,
        description: job.description,
        address: job.address,
        createdAt: new Date(),
        createdBy: req.user.role,
        expireAt: job.expireAt,
        validated: job.validated,
        extension: 1,
        sponsored: job.sponsored,
      });
      return sjob;
}

exports.jobController = { createJob,createSavedJob};