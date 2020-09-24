
const router = require("express").Router(),
  passport = require("passport"),
  middleware = require("../middleware/index"),
  User = require("../models/user.model"),
  Job = require("../models/job.model"),
  Freelance = require("../models/freelance.model"),
  Employer = require("../models/employer.model"),
  savedJob = require("../models/savedJobs.model"),
  savedFreelance = require("../models/savedFreelance.model");
const fs = require("fs"),
  path = require('path'),    
  filePath = path.join(__dirname, '../canopus-frontend/build/data.json');
  

  async function assignTier(req,employer,type){
    //checking tier on basis of job category
    var subscription;
    if(req.body.category === "Full-time" || req.body.category === "Part-time") subscription="jobtier";
    else if(req.body.category === "Day Job") subscription="freelancetier";
    else if(req.body.category === "Locum") subscription = "locumtier";
    else return false;

    // // checking if employer is validated and limiting jobs
    // if (type=== "posted" && employer.validated == false && (employer[subscription][type] > 0) )
    //   return false;

    //updating job tier
    if (employer[subscription].allowed - employer[subscription][type] <= 0)
      return false;
    else employer[subscription][type] += 1;

     //checking sponsorship status
    if(req.body.sponsored === "true" && employer.sponsors.posted >= employer.sponsors.allowed)
     return false;
    else if(req.body.sponsored === "true") 
     employer.sponsors.posted += 1;
     
    return employer;
    
  }
//create job
async function createJob(req,data,employer,extension){
  let valid = await validateRequest(req);
  if(!valid){console.log(req);return false; }
    let author = {};
    author.username = req.user.username;
    author.id = req.user._id;
    //different author options for employer and user
    if(req.user.role === "Employer"){
    author.instituteName = req.user.instituteName;
    author.photo = req.user.logo;
    }
    else{
      author.name = `${employer.salutation} ${employer.firstName} ${employer.lastName}`;
    }
    if(req.body.category === "Full-time" || req.body.category === "Part-time"){
    //set expiry date
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 45);

    let job = new Job({
        author:author,
        title: data.title,
        profession: data.profession,
        specialization: data.specialization,
        superSpecialization: data.superSpecialization,
        tag:data.tag,
        description: data.description,
        address: data.address,
        createdAt: new Date(),
        createdBy: req.user.role,
        expireAt: expiry,
        validated: employer.validated,
        sponsored: data.sponsored || false,
        extension: extension || 1,
        category:data.category,
      });
    return job;
    }
    else if(req.body.category === "Day Job" || req.body.category === "Locum"){

        let freelance = new Freelance({
            author : author,
            title : data.title,
            profession : data.profession,
            specialization : data.specialization,
            superSpecialization : data.superSpecialization,
            tag : data.tag,
            description : data.description,
            address : data.address,
            startDate : data.startDate,
            endDate : data.endDate,
            attachedApplicants : data.attachedApplicants,
            category : data.category,
            createdAt : new Date(),
            createdBy : req.user.role,
            expireAt : data.endDate,
            validated : employer.validated,
            sponsored : data.sponsored || false ,
        });
        return freelance;
    }
    else return false;
    //  return freelance;
   
}
//create saved job
async function createSavedJob(req,data,status){
  let author = {};
    author.username = req.user.username;
    author.id = req.user._id;
    //different author options for employer and user
    if(req.user.role === "Employer"){
    author.instituteName = req.user.instituteName;
    author.photo = req.user.logo;
    }
    else{
      author.name = `${req.user.salutation} ${req.user.firstName} ${req.user.lastName}`;
    }
    if(req.body.category === "Full-time" || req.body.category === "Part-time"){
      let sjob = new savedJob({
          jobRef: data._id,
          status: status,
          author: author,
          title: data.title,
          profession: data.profession,
          specialization: data.specialization,
          superSpecialization: data.superSpecialization,
          tag : data.tag,
          description: data.description,
          address: data.address,
          createdAt: new Date(),
          createdBy: req.user.role,
          extension: 1,
          category:data.category,
        });
        return sjob;
    }
    else{
      let freelance = new savedFreelance({
        jobRef: data._id,
        status: status,
        author: author,
        title: data.title,
        profession: data.profession,
        specialization: data.specialization,
        superSpecialization: data.superSpecialization,
        tag : data.tag,
        description: data.description,
        address: data.address,
        startDate: data.startDate,
        endDate: data.endDate,
        attachedApplicants: data.attachedApplicants,
        createdAt: new Date(),
        createdBy: req.user.role,
        category: data.category,
      });
      return freelance;
    }
}

async function updateQueryBuilder(req){
  var query={};
  if(req.body.title) query["title"]=req.body.title;
  if(req.body.profession) query["profession"]=req.body.profession;
  if(req.body.specialization) query["specialization"]=req.body.specialization
  if(req.body.superSpecialization) query["superSpecialization"]=req.body.superSpecialization;
  if(req.body.tag) query["tag"]=req.body.tag;
  if(req.body.address) query["address"]=req.body.address;
  if(req.body.description) query["description"]=req.body.description;
  if(req.body.startDate) query["startDate"]=req.body.startDate;
  if(req.body.endDate){query["endDate"]=req.body.endDate;query["expireAt"]=req.body.endDate;}
  return query;
}

async function createApplicant(user){
  return {
    id: user._id,
    name: `${user.salutation} ${user.firstName} ${user.lastName}`,
    image: user.image,
    username: user.username,
    phone: user.phone,
  };
}

async function readFileAsync(){
  var data=null;
  return new Promise((resolve, reject)=>{
      fs.readFile(filePath, function(err, rawdata) {
              if (err) throw err;
              data=JSON.parse(rawdata);
              //console.log(data);
              resolve(data);
         });
      })
}

async function validateRequest(req){
  

  let data = await readFileAsync();
  var flag = false;
  // perform validation
  // incentives validation
  if(req.body.incentives){
    if(req.body.incentives.every(incentive=>data.incentives.includes(incentive)))
    flag = true;
    else  return false;
  }
  //tag validation
  if(req.body.tag && data.tags.includes(req.body.tag))
  flag = true;
  //else return false;
  // profession specialization superspecialization validation
  if(req.body.superSpecialization){
    if(data.superSpecialization.some(data=>
      data.superSpecialization===req.body.superSpecialization &&
      data.specialization===req.body.specialization && 
      data.profession===req.body.profession
    ))
    flag = true;
  }
  else if(req.body.specialization){
    if(data.specialization2.some(data=>
      data.specialization===req.body.specialization && 
      data.profession===req.body.profession
    ))
    flag = true;
  }
  else if(req.body.profession){
    if(data.superSpecialization.some(data=>
      data.profession===req.body.profession
    ))
    flag = true;
  }
  else flag = false;
  return flag;

}
exports.jobController = { createJob, createSavedJob, assignTier, updateQueryBuilder ,createApplicant};