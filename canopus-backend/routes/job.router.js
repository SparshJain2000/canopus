//controllers
const { searchController }     = require("../controllers/search.controller"),
      { mailController }       = require("../controllers/mail.controller"),
      { validationController } = require("../controllers/validation.controller"),
      { jobController }        = require ( "../controllers/job.controller");
//dependencies
const mongoose   = require("mongoose"),
      router     = require("express").Router(),
      middleware = require("../middleware/index");
//initalize models
const User           = require("../models/user.model"),
      Employer       = require("../models/employer.model"),
      Job            = require("../models/job.model"),
      Freelance      = require("../models/freelance.model"), 
      savedJob       = require("../models/savedJobs.model"),
      savedFreelance = require("../models/savedFreelance.model");
//initialize analytics
require("dotenv").config();
const GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS;
var ua = require("universal-analytics");
var visitor = ua(GOOGLE_ANALYTICS);


//post a job
router.post("/post", middleware.isLoggedIn, middleware.dateValidator, async (req, res) => {
  //start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  const server_error = new Error("500");
  const client_error = new Error("400");
  //try block
  try {
    //check user role
    if ( req.user.role === "Employer" )
      var employer = await Employer.findById(req.user._id).session(session);
    else if ( req.user.role === "User" )
      var employer = await User.findById(req.user._id).session(session);
    //check tier and sponsorship status
    employer = await jobController.assignTier(req,employer,"posted");
    //error if invalid tier 
    if(!employer) throw client_error;

    //DB operations start here
    //create job
    let job = await jobController.createJob(req,employer);
    if(!job) throw client_error;

    //insert job
    if(req.body.category === "Job")
      job = await Job.create([job], { session: session });
    else
      job = await Freelance.create([job],{ session: session });
    //only arrays can be used in transactions so casting is necessary
    job = job[0];

    //create saved job
    let sjob = await jobController.createSavedJob(req,job,"Active");
    if(!sjob) throw client_error;

    var type;
    if(req.body.category === "Job"){
      sjob = await savedJob.create([sjob], { session: session });
      type = "jobs";
    }
    else {
      sjob = await savedFreelance.create([sjob],{ session: session });
      type = "freelanceJobs";
    }
    sjob = sjob[0];

    //update employer add job and saved job ref
    employer[type].push(
      {
        title: job.title,
        id: job._id,
        sid: sjob._id,
      });
    //save changes to employer
    await employer.save({ session });

    //commit transaction
    await session.commitTransaction();
    session.endSession();
    res.json({status:"200"});

  } catch (err) {
    // any 500 error in try block aborts transaction
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    res.status(500).json({status:"500"});
  } 
});

//save a job
router.post("/save", middleware.isLoggedIn, async (req, res) => {
  //start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  const error = new Error("500");
  //try block
  try {
    //check user role
    if ( req.user.role === "Employer" )
      var employer = await Employer.findById(req.user._id).session(session);
    else if ( req.user.role === "User" )
      var employer = await User.findById(req.user._id).session(session);
    //check tier and sponsorship status
    employer = await jobController.assignTier(req,employer,"saved");
    //error if invalid tier 
    if(!employer) throw error;

    //DB operations start here
    
    //create saved job
    let sjob = await jobController.createSavedJob(req,job,"Saved");
    if(!sjob) throw error;

    var type;
    if(req.body.category === "Job"){
      sjob = await savedJob.create([sjob], { session: session });
      type = "savedJobs";
    }
    else {
      sjob = await savedFreelance.create([sjob],{ session: session });
      type = "savedFreelance";
    }
    sjob = sjob[0];

    //update employer add job and saved job ref
    employer[type].push(sjob._id);
    //save changes to employer
    await employer.save({ session });

    //commit transaction
    await session.commitTransaction();
    session.endSession();
    res.json({status:"200"});

  } catch (err) {
    // any 500 error in try block aborts transaction
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    res.status(500).json({status:"500"});
  } 
});

//activate a saved Job
router.put("/activate/:id", middleware.isEmployer, async (req,res) => {
  //start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  const server_error = new Error("500");
  const client_error = new Error("400");
  //try block
  try {
    //check user role
    if ( req.user.role === "Employer" )
      var employer = await Employer.findById(req.user._id).session(session);
    else if ( req.user.role === "User" )
      var employer = await User.findById(req.user._id).session(session);
    //check tier and sponsorship status
    employer = await jobController.assignTier(req,employer,"posted");
    //error if invalid tier 
    if(!employer) throw error;

    //DB operations start here
    //create job
    let job = await jobController.createJob(req,employer);
    if(!job) throw error;

    //insert job
    if(req.body.category === "Job")
      job = await Job.create([job], { session: session });
    else
      job = await Freelance.create([job],{ session: session });
    //only arrays can be used in transactions so casting is necessary
    job = job[0];

    //create saved job
    let sjob = await jobController.createSavedJob(req,job,"Active");
    if(!sjob) throw error;

    var type;
    if(req.body.category === "Job"){
      sjob = await savedJob.create([sjob], { session: session });
      type = "jobs";
    }
    else {
      sjob = await savedFreelance.create([sjob],{ session: session });
      type = "freelanceJobs";
    }
    sjob = sjob[0];

    //update employer add job and saved job ref
    employer[type].push(
      {
        title: job.title,
        id: job._id,
        sid: sjob._id,
      });
    //save changes to employer
    await employer.save({ session });

    //commit transaction
    await session.commitTransaction();
    session.endSession();
    res.json({status:"200"});

  } catch (err) {
    // any 500 error in try block aborts transaction
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    res.status(500).json({status:"500"});
  } 
});
//validate a saved job
router.put("/save/job/activate/:id", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      if (!employer.savedJobs.includes(req.params.id))
        return res.status(400).json({ err: "Wrong job ID" });
      if (employer.validated == false && employer.jobtier.posted > 1)
        return res
          .status(400)
          .json({ err: "Can only post one job until you are validated" });
      savedJob
        .findById(req.params.id)
        .then((sjob) => {
          // const expiry = sjob.expireAt;
          // var days = (expiry - Date.now()) / (1000 * 60 * 60 * 24);
          // if (days < 0 || days > 90)
          //   return res.status(400).send("Invalid time range spcified");
          var expiry = new Date();
          expiry.setDate(expiry.getDate() + 45);
          if (employer.jobtier.allowed - employer.jobtier.saved <= 0)
            return res.status(400).send("Max Jobs Saved");
          else
            Employer.findByIdAndUpdate(req.user._id, {
              $inc: { "jobtier.posted": 1 },
              $inc: { "jobtier.saved": -1 },
            })
              .then((employer2) => {
                let job = new Job({
                  author: sjob.author,
                  title: sjob.title,
                  profession: sjob.profession,
                  specialization: sjob.specialization,
                  superSpecialization: sjob.superSpecialization,
                  description: sjob.description,
                  address: sjob.address,
                  createdAt: new Date(),
                  expireAt: expiry,
                  validated: employer.validated,
                  extension: 1,
                });
                //console.log(job);
                job
                  .save()
                  .then((job) => {
                    //console.log(job._id);
                    employer.jobs = [
                      ...employer.jobs,
                      {
                        title: job.title,
                        id: job._id,
                        sid: sjob._id,
                      },
                    ];
                    employer.savedJobs.splice(
                      employer.savedJobs.indexOf(sjob._id),
                      1
                    );
                    employer
                      .save()
                      .then((employer) => {
                        sjob.extension = 1;
                        sjob.jobRef = job._id;
                        sjob.status = "Active";
                        sjob.createdAt = new Date();
                        sjob.expireAt = expiry;
                        sjob
                          .save()
                          .then((sjob) => {
                            res.status(200).json({ updated: "true" });
                          })
                          .catch((err) => {
                            res
                              .status(400)
                              .json({ err: "Saved job not saved" });
                          });
                      })
                      .catch((err) => {
                        res.status(400).json({ err: "Employer not updated" });
                      });
                  })
                  .catch((err) => {
                    res.status(400).json({ err: "job not saved" });
                  });
                // Employer.findOne({_id:req.user._id}).then((employer)=>{
              })
              .catch((err) => {
                res.status(400).json({ err: "Employer not updated" });
              });
        })
        .catch((err) => {
          res.status(400).json({ err: "Saved Job not found" });
        });
      // })
    })
    .catch((err) => {
      res.status(400).json({ err: "Employer not found" });
    });
});

//validate a saved freelance job
router.put(
  "/save/freelance/activate/:id",
  middleware.isEmployer,
  (req, res) => {
    Employer.findById(req.user._id)
      .then((employer) => {
        if (!employer.savedFreelance.includes(req.params.id))
          return res.status(400).json({ err: "Wrong job ID" });
        if (employer.validated == false && employer.freelancetier.posted > 1)
          return res
            .status(400)
            .json({ err: "Can only post one job until you are validated" });
        savedFreelance
          .findById(req.params.id)
          .then((sjob) => {
            const expiry = new Date(sjob.endDate);
            var days = (expiry - Date.now()) / (1000 * 60 * 60 * 24);
            if (days < 0 || days > 30)
              return res.status(400).send("Invalid time range spcified");
            if (
              employer.freelancetier.allowed - employer.freelancetier.saved <=
              0
            )
              return res.status(400).send("Max Jobs Saved");
            else
              Employer.findByIdAndUpdate(req.user._id, {
                $inc: { "freelancetier.posted": 1 },
                $inc: { "freelancetier.saved": -1 },
              })
                .then((employer2) => {
                  let job = new Freelance({
                    author: sjob.author,
                    title: sjob.title,
                    profession: sjob.profession,
                    specialization: sjob.specialization,
                    superSpecialization: sjob.superSpecialization,
                    description: sjob.description,
                    address: sjob.address,
                    createdAt: new Date(),
                    startDate: sjob.startDate,
                    attachedApplicants: req.body.attachedApplicants,
                    createdBy: "Employer",
                    expireAt: expiry,
                    endDate: expiry,
                    validated: employer.validated,
                  });
                  //console.log(job);
                  job
                    .save()
                    .then((job) => {
                      //console.log(job._id);
                      employer.freelanceJobs = [
                        ...employer.freelanceJobs,
                        {
                          title: job.title,
                          id: job._id,
                          sid: sjob._id,
                        },
                      ];
                      employer.savedFreelance.splice(
                        employer.savedFreelance.indexOf(sjob._id),
                        1
                      );
                      employer
                        .save()
                        .then((employer) => {
                          sjob.jobRef = job._id;
                          sjob.status = "Active";
                          sjob.createdAt = new Date();
                          sjob.expireAt = expiry;
                          sjob
                            .save()
                            .then((sjob) => {
                              res.status(200).json({ updated: "true" });
                            })
                            .catch((err) => {
                              res
                                .status(400)
                                .json({ err: "Saved job not saved" });
                            });
                        })
                        .catch((err) => {
                          res.status(400).json({ err: "Employer not updated" });
                        });
                    })
                    .catch((err) => {
                      res.status(400).json({ err: "job not saved" });
                    });
                  // Employer.findOne({_id:req.user._id}).then((employer)=>{
                })
                .catch((err) => {
                  res.status(400).json({ err: "Employer tier not updated" });
                });
          })
          .catch((err) => {
            res.status(400).json({ err: "Saved Job not found" });
          });
        // })
      })
      .catch((err) => {
        res.status(400).json({ err: "Employer not found" });
      });
  }
);
//===========================================================================

//Update a job
router.put("/post/job/:id", middleware.checkJobOwnership, async (req, res) => {
  var query;
  if (req.body.status == "Active")
    res.status(400).json({ err: "Invalid status" });
  query = await searchController.updateQueryBuilder(req);
  //console.log(query.updateQuery);
  Job.findById(req.params.id)
    .then((job) => {
      // if (req.body.expireAt) {
      //   const expiry = new Date(req.body.expireAt);
      //   var days = (expiry - job.createdAt) / (1000 * 60 * 60 * 24);
      //   //console.log(days);
      //   if (days < 0 || days > 90)
      //     res.status(400).json({ err: "Invalid time format" });
      //   else query.update["expireAt"] = expiry;
      // }
      Job.findOneAndUpdate(
        { _id: req.params.id },
        { $set: query.update },
        { new: true }
      )
        .then((job) => {
          console.log(job);
          savedJob
            .findOneAndUpdate({ jobRef: job._id }, { $set: query.update })
            .then((employer) => {
              res.status(200).json({ updated: "true" });
              // employer.save().then((updatedEmployer)=>{
              // res.status(200).json({updated:"true"});
              // }).catch((err)=>{res.status(400).json({err:"Failed to save job"})});
            })
            .catch((error) => {
              res.status(400).json({ err: "Job not updated" });
            });
        })
        .catch((error) => {
          res.status(400).json({ updated: "false" });
        });
    })
    .catch((err) => {
      res.status(400).json({ err: "Couldn't find employer" });
    });
});
//Update a freelance job
router.put(
  "/post/freelance/:id",
  middleware.checkFreelanceJobOwnership,
  async (req, res) => {
    var query;
    if (req.body.status == "Active")
      return res.status(400).json({ err: "Invalid status" });
    query = await searchController.updateQueryBuilder(req);
    //console.log(query.updateQuery);
    Freelance.findById(req.params.id)
      .then((job) => {
        if (req.body.startDate) query.update["startDate"] = req.body.startDate;
        if (req.body.endDate) query.update["endDate"] = req.body.endDate;
        if (req.body.attachedApplicants)
          query.update["attachedApplicants"] = req.body.attachedApplicants;
        if (req.body.endDate) {
          const expiry = new Date(req.body.endDate);
          var days = (expiry - job.createdAt) / (1000 * 60 * 60 * 24);
          if (days < 0 || days > 90)
            return res.status(400).json({ err: "Invalid time format" });
          else query.update["expireAt"] = expiry;
        }
        // if(req.body.sponsored) {
        // 	query.update["sponsored"]=true;
        // }
        Freelance.findByIdAndUpdate(req.params.id, { $set: query.update })
          .then((job) => {
            savedFreelance
              .findOneAndUpdate({ jobRef: job._id }, { $set: query.update })
              .then((employer) => {
                res.status(200).json({ updated: "true" });
              })
              .catch((err) => res.status(400).json({ err: "Job not saved" }));
          })
          .catch((err) => {
            res.status(400).json({ updated: "false" });
          });
      })
      .catch((err) => {
        res.status(400).json({ err: "Couldn't find employer" });
      });
  }
);

//Update a saved job
router.put("/save/job/:id", middleware.isEmployer, async (req, res) => {
  var query;
  if (req.body.status == "Active")
    return res.status(400).json({ err: "Invalid status" });
  query = await searchController.updateQueryBuilder(req);
  //console.log(query.updateQuery);
  Employer.findById(req.user._id)
    .then((employer) => {
      if (!employer.savedJobs.includes(req.params.id))
        return res.status(400).json({ err: "Invalid Job" });
      savedJob
        .findById(req.params.id)
        .then((job) => {
          // if (req.body.expireAt) {
          //   const expiry = new Date(req.body.expireAt);
          //   var days = (expiry - Date.now()) / (1000 * 60 * 60 * 24);
          //   //console.log(days);
          //   if (days < 0 || days > 90)
          //     return res.status(400).json({ err: "Invalid time format" });
          //   else query.update["expireAt"] = expiry;
          // }

          savedJob
            .findOneAndUpdate(
              { _id: req.params.id },
              { $set: query.update },
              { new: true }
            )
            .then((job) => {
              //console.log(job);
              //savedJob.findOneAndUpdate({jobRef:job._id},{$set:query.update}).then((employer)=>{
              res.status(200).json({ updated: "true" });
              // employer.save().then((updatedEmployer)=>{
              // res.status(200).json({updated:"true"});
              // }).catch((err)=>{res.status(400).json({err:"Failed to save job"})});
            })
            .catch((error) => {
              res.status(400).json({ err: "Job not updated" });
            });
        })
        .catch((error) => {
          res.status(400).json({ err: "Couldn't find job" });
        });
    })
    .catch((err) => {
      res.status(400).json({ err: "Couldn't find employer" });
    });
});

//Update a saved freelance job
router.put("/save/freelance/:id", middleware.isEmployer, async (req, res) => {
  var query;
  if (req.body.status == "Active")
    return res.status(400).json({ err: "Invalid status" });
  query = await searchController.updateQueryBuilder(req);
  //console.log(query.updateQuery);
  Employer.findById(req.user._id)
    .then((employer) => {
      if (!employer.savedFreelance.includes(req.params.id))
        return res.status(400).json({ err: "Invalid Job" });
      savedFreelance
        .findById(req.params.id)
        .then((job) => {
          if (req.body.attachedApplicants)
            query.update["attachedApplicants"] = req.body.attachedApplicants;
          if (req.body.endDate) {
            const expiry = new Date(req.body.endDate);
            var days = (expiry - Date.now()) / (1000 * 60 * 60 * 24);
            //console.log(days);
            if (days < 0 || days > 30)
              return res.status(400).json({ err: "Invalid time format" });
            else query.update["expireAt"] = expiry;
          }

          savedFreelance
            .findOneAndUpdate(
              { _id: req.params.id },
              { $set: query.update },
              { new: true }
            )
            .then((job) => {
              //console.log(job);
              //savedJob.findOneAndUpdate({jobRef:job._id},{$set:query.update}).then((employer)=>{
              res.status(200).json({ updated: "true" });
              // employer.save().then((updatedEmployer)=>{
              // res.status(200).json({updated:"true"});
              // }).catch((err)=>{res.status(400).json({err:"Failed to save job"})});
            })
            .catch((error) => {
              res.status(400).json({ err: "Job not updated" });
            });
        })
        .catch((error) => {
          res.status(400).json({ err: "Couldn't find job" });
        });
    })
    .catch((err) => {
      res.status(400).json({ err: "Couldn't find employer" });
    });
});
module.exports = router;