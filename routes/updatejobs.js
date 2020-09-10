const { search } = require("./admin.router");
const { searchController } = require("../controllers/search.controller");
const { query: q } = require("express");

const router = require("express").Router(),
middleware = require("../middleware/index"),
Employer = require("../models/employer.model"),
User = require("../models/user.model"),
Job = require("../models/job.model"),
Freelance = require("../models/freelance.model");
// const expiry=new Date("2020-11-24T00:00:00.000+05:30");
// // console.log(expiryDate.toISOString())
// //const expiryDate=new Date()
// //expiryDate.toLocaleString("en-US", {timeZone: "America/New_York"})
// // console.log(expiryDate)
// // console.log(Math.abs((new Date().getTime() - expiryDate.getTime()) / (60*60)));
// console.log((expiry-Date.now())/(1000*60*60*24));
// Job.createIndexes( { "createdAt": 1 }, { expireAfterSeconds: 3600 }).then((res)=>{console.log(res)})

//employer.savedJobs=employer.savedJobs.splice (employer.savedJobs.indexOf(sjob._id),1);

var array=["author","me","hello","you"];
//console.log(array[0]["author"]);

array=array.splice(array.indexOf('me'),1)
console.log(array);
