const { checkJobOwnership } = require("../middleware");

const router = require("express").Router(),
    passport = require("passport"),
    middleware = require("../middleware/index"),
    Job = require("../models/job.model"),
    Freelance = require("../models/freelance.model"),
    Employer = require("../models/employer.model");
//TODO Update query builder
function updateQueryBuilder(req){
    //if
    }