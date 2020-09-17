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
//TODO:
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


//updated a posted job
router.put("/post/:id",middleware.isLoggedIn,middleware.checkPostOwnership, async (req,res) => {
  //start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  const server_error = new Error("500");
  const client_error = new Error("400");
  //try block
  try {
    const query = await jobController.updateQueryBuilder(req);
    if(!query) throw client_error;

    //DB operations start here
    if(req.body.category === "Job"){
    //update job
      const job = await Job.findOneAndUpdate(
        { _id: req.params.id },
        { $set: query },
        { new: true, session: session }
      );
      //reflect changes on saved job
      await savedJob.findOneAndUpdate({ jobRef: job._id }, { $set: query },{ session: session });
    } 
    else {
      if(req.body.endDate){
        const job = await Freelance.findById(req.params.id).session(session);
        const expiry = new Date(req.body.endDate);
        var days = (expiry - job.createdAt) / (1000 * 60 * 60 * 24);
        if (days < 0 || days > 30)
          throw client_error;
      }
        //update job
        const job = await Freelance.findOneAndUpdate(
          { _id: req.params.id },
          { $set: query },
          { new: true, session: session }
        );
        //reflect changes on saved job
        await savedFreelance.findOneAndUpdate({ jobRef: job._id }, { $set: query },{ session: session }); 
    }
    
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
//TODO:
//updated a saved job
router.put("/save/:id",middleware.isLoggedIn,middleware.checkSavedOwnership, async (req,res) => {
  //start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  const server_error = new Error("500");
  const client_error = new Error("400");
  //try block
  try {
    const query = await jobController.updateQueryBuilder(req);
    if(!query) throw client_error;

    //DB operations start here
    if(req.body.category === "Job"){
      //update job
      await savedJob.findOneAndUpdate({ jobRef: job._id }, { $set: query },{ session: session });
    } 
    else {
      if(req.body.endDate){
        const job = await Freelance.findById(req.params.id).session(session);
        const expiry = new Date(req.body.endDate);
        var days = (expiry - job.createdAt) / (1000 * 60 * 60 * 24);
        if (days < 0 || days > 30)
          throw client_error;
      }
        //update job
        await savedFreelance.findOneAndUpdate({ jobRef: job._id }, { $set: query },{ session: session }); 
    }
    
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
//TODO:
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
    if(!employer) throw client_error;

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

  } catch(err) {
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

router.put("/extend/:id",middleware.isLoggedIn, async(req, res) => {
  
})
//extend a job not expired not closed
router.put("/extend/job/:id", middleware.isEmployer, (req, res) => {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 45);

  savedJob
    .findOne({ jobRef: mongoose.Types.ObjectId(req.params.id) })
    .then((job) => {
      if (job.status == "Closed")
        return res.status(400).json({ err: "Closed jobs cannot be extended" });
      if (job.extension == 0)
        return res.status(400).json({ err: "Job cannot be extended again" });
      job.extension = 0;
      job.expireAt = expiry;
      //console.log(job);
      job
        .save()
        .then((job) => {
          //console.log(job._id);
          Job.findById(req.params.id)
            .then((sjob) => {
              sjob.extension = 0;
              sjob.expireAt = expiry;
              sjob
                .save()
                .then((sjob) => {
                  res.status(200).json({ updated: "true" });
                })
                .catch((err) => {
                  res.status(400).json({ err: "Job not saved" });
                });
              //}).catch((err)=>{res.status(400).json({err:"Employer not updated"})});
            })
            .catch((err) => {
              res.status(400).json({ err: "Saved Job not saved" });
            });
        })
        .catch((err) => {
          res.status(400).json({ err: "Job not saved" });
        });
    })
    .catch((err) => {
      res.status(400).json({ err: "Job not found" });
    });
});
//extend an expired job
router.put("/extend/expired/:id", middleware.isEmployer, (req, res) => {
  //   if (!req.body.expireAt)
  //     return res.status(400).json({ err: "Date parameter required" });
  //   const expiry = new Date(req.body.expireAt);
  //   var days = (expiry - Date.now()) / (1000 * 60 * 60 * 24);
  //   if (days < 0 || days > 45)
  // 	return res.status(400).json({ err: "Invalid time format" });
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 45);
  Employer.findById(req.user._id).then((employer) => {
    savedJob.findById(req.params.id).then((sjob) => {
      if (sjob.status == "Closed")
        return res.status(400).json({ err: "Closed jobs cannot be extended" });
      if (sjob.extension == 0)
        return res.status(400).json({ err: "Job cannot be extended again" });

      let job = new Job({
        author: sjob.author,
        title: sjob.title,
        profession: sjob.profession,
        specialization: sjob.specialization,
        superSpecialization: sjob.superSpecialization,
        tag: sjob.tag,
        description: sjob.description,
        address: sjob.address,
        createdAt: new Date(),
        expireAt: expiry,
        validated: employer.validated,
        extension: 0,
      });
      //console.log(job);
      job
        .save()
        .then((job) => {
          //console.log(job._id);
          employer.jobs = employer.jobs.filter(
            (job) => job.sid != req.params.id
          );
          employer.jobs = [
            ...employer.jobs,
            {
              title: job.title,
              id: job._id,
              sid: sjob._id,
            },
          ];
          employer
            .save()
            .then((employer) => {
              sjob.extension = 0;
              sjob.jobRef = job._id;
              sjob.status = "Active";
              sjob.expireAt = expiry;
              sjob
                .save()
                .then((sjob) => {
                  res.status(200).json({ updated: "true" });
                })
                .catch((err) => {
                  res.status(400).json({ err: "Saved job not saved" });
                });
            })
            .catch((err) => {
              res.status(400).json({ err: "Employer not updated" });
            });
        })
        .catch((err) => {
          res.status(400).json({ err: "job not saved" });
        });
    });
  });
});


//sponsor a job
router.put("/sponsor/:id", middleware.checkPostOwnership, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      const Id = employer.jobs.map((item) => {
        return mongoose.Types.ObjectId(item.id);
      });
      if (!Id.includes(req.params.id))
        return res.status(400).json({ err: "Incorrect job ID" });
      if (employer.sponsors.allowed - employer.sponsors.posted <= 0)
        return res.status(400).json({ err: "No sponsors remaining" });
      Employer.findByIdAndUpdate(req.user._id, {
        $inc: { "sponsors.posted": 1 },
      })
        .then((employer) => {
          Job.findByIdAndUpdate(req.params.id, { $set: { sponsored: true } })
            .then((job) => {
              res.json({ job: job });
            })
            .catch((err) => {
              res.status(400).json({ err: "Job not updated" });
            });
        })
        .catch((err) => {
          res.status(400).json({ err: "Employer not found" });
        });
    })
    .catch((err) => {
      res.status(400).json({ err: "Employer not found" });
    });
});



// Accept an day job applicant
router.put("/apply/freelance/:id",middleware.checkFreelanceJobOwnership, async (req, res) => {
  //start transaction
const session = await mongoose.startSession();
session.startTransaction();
const server_error = new Error("500");
const client_error = new Error("400");
try {
  //check user role
  if ( req.user.role === "Employer" )
    var employer = await Employer.findById(req.user._id).session(session);
  else if ( req.user.role === "User" )
    var employer = await User.findById(req.user._id).session(session);
  //find user
  const user = User.findById(req.body.id).session(session);
  if(!user) throw client_error;
  //check number of accepted applicants
  let job = await Freelance.findById(req.params.id).session(session);
  
  const userId = job.acceptedApplicants.map((item) => {
    return mongoose.Types.ObjectId(item.id);
    });
  let applicant = await jobController.createApplicant(user);
  if(ids.includes(req.body.id))
    return res.status(400).json({err:"Candidate already accepted"});
  //accept applicants
  if (job.description.count - job.acceptedApplicants.length === 0){
    //delete freelance max applicants
    if(job.sponsored==="true")
      employer.sponsors.closed+=1;
    sjob.status = "Closed";
    await Freelance.deleteOne(req.params.id).session(session);
  }
  else{
    job.acceptedApplicants.push(applicant);
    await job.save({ session });
  }
  //save applicant to saved job
  let sjob = await savedFreelance.findOne({jobRef:job._id}).session(session);
  sjob.acceptedApplicants.push(applicant);
  await sjob.save({ session });
  //save applicant to employer
  employer.acceptedApplicants.push(applicant);
  await employer.save({ session });

} catch(err){
   // any 500 error in try block aborts transaction
   await session.abortTransaction();
   session.endSession();
   console.log(err);
   res.status(500).json({status:"500"});    
}
});
module.exports = router;