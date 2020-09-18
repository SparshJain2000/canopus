const { searchController } = require("../controllers/search.controller");
const { mailController } = require("../controllers/mail.controller");
const { validationController } = require("../controllers/validation.controller");
require("dotenv").config();
const GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS;
var ua = require("universal-analytics");
var visitor = ua(GOOGLE_ANALYTICS);
const mongoose = require("mongoose");
const crypto = require("crypto");
const { promisify } = require("util");
const asyncify = require("express-asyncify");
const router = require("express").Router(),
  passport = require("passport"),
  middleware = require("../middleware/index"),
  User = require("../models/user.model"),
  Job = require("../models/job.model"),
  Freelance = require("../models/freelance.model"),
  savedJob = require("../models/savedJobs.model"),
  savedFreelance = require("../models/savedFreelance.model");

//===========================================================================
//get all users
router.route("/").get((req, res) => {
  User.find()
    .then((users) => {
      res.json({
        users: users.map((user) => {
          return { username: user };
        }),
      });
    })
    .catch((err) => res.status(400).json({ err: err }));
});
//===========================================================================
//Sign up route
router.post("/", (req, res) => {
  const user = new User({
    username: req.body.username,
    salutation: req.body.salutation,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    description: req.body.description,
    createdAt: Date.now(),
    validated: false,
    jobtier: {
      allowed: 0,
      posted: 0,
      saved: 0,
      closed: 0,
    },
    freelancetier: {
      allowed: 0,
      posted: 0,
      saved: 0,
      closed: 0,
    },
    locumtier: {
      allowed: 0,
      posted: 0,
      saved: 0,
      closed: 0,
    },
    sponsors: {
      posted:0,
      allowed:0,
    },
    // address: {
    //     pin: req.body.pin,
    //     city: req.body.city,
    //     state: req.body.state,
    // },
    experience: req.body.experience,
    role: "User",
  });
  User.register(user, req.body.password)
    .then((user) => {
      passport.authenticate("user")(req, res, () => {
        res.json({ user: user });
      });
    })
    .catch((err) => res.status(400).json({ err: err }));
});
//===========================================================================
//Login route
// router.post("/login", passport.authenticate("user"), (req, res) => {
//     res.json({ user: req.user, message: `${req.user.username} Logged in` });
// });
router.post("/login", function (req, res, next) {
  passport.authenticate("user", (err, user, info) => {
    console.log(info);
    if (err) {
      return res.status(400).json({ err: err });
    }
    if (!user) {
      return res.status(400).json({ err: info });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(400).json({ err: err });
      }
     // visitor.event("User", "Login").send();
      return res.json({
        user: req.user,
        message: `${req.user.username} Logged in`,
      });
    });
  })(req, res, next);
});
//===========================================================================
//Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.json({ message: "Logged Out" });
});
router.get("/current", (req, res) => {
  res.json({ user: req.user });
});
//===========================================================================
//Forgot password route

router.post("/forgot", async (req, res, next) => {
  const token = (await promisify(crypto.randomBytes)(20)).toString("hex");
  User.findOneAndUpdate(
    { username: req.body.username },
    {
      $set: {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
    }
  )
    .then((user) => {
      console.log(token);
      mailController
        .forgotMail(req, user, token)
        .then((response) => {
          res.json({ status: "Email has been sent" });
          //res.redirect('/forgot');
        })
        .catch((err) => {
          res.json({ err: "Mail not sent" });
        });
    })
    .catch((err) => {
      res.json({ err: "User not found" });
    });
});

router.post("/reset/:token", async (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token })
    .then((user) => {
      if (
        user.resetPasswordExpires > Date.now() &&
        crypto.timingSafeEqual(
          Buffer.from(user.resetPasswordToken),
          Buffer.from(req.params.token)
        )
      )
        // console.log(user);
        // if (!user) {
        //   req.flash('error', 'Password reset token is invalid or has expired.');
        //   return res.redirect('/forgot');
        // }
        user
          .setPassword(req.body.password)
          .then((user) => {
            //user.save();
            user
              .save()
              .then((user) => {
                User.findOneAndUpdate(
                  { resetPasswordToken: req.params.token },
                  { $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 } }
                )
                  .then((user) => {
                    const resetEmail = {
                      to: user.username,
                      from:
                        "postmaster@sandboxa6c1b3d7a13a4122aaa846d7cd3f96a2.mailgun.org",
                      subject: "Your password has been changed",
                      text: `
              This is a confirmation that the password for your account "${user.username}" has just been changed.
            `,
                    };
                    mailController.transport.sendMail(resetEmail);
                    res.json({ status: "Updated" });
                  })
                  .catch((err) => {
                    res.status(400).json({ err: "Fields not unset" });
                  });
              })
              .catch((err) => {
                res.status(400).json({ err: "Password not saved" });
              });
          })
          .catch((err) => {
            res.status(400).json({ err: "Password not set" });
          });
      //req.flash('success', `Success! Your password has been changed.`);
    })
    .catch((err) => {
      res.json({ err: "User not found" });
    });
});

//verify email

//regenerate mail verify token
router.post("/forgot", async (req, res, next) => {
  const token = (await promisify(crypto.randomBytes)(20)).toString("hex");
  User.findOneAndUpdate(
    { username: req.body.username },
    {
      $set: {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
    }
  )
    .then((user) => {
      console.log(token);
      mailController
        .forgotMail(req, user, token)
        .then((response) => {
          res.json({ status: "Email has been sent" });
          //res.redirect('/forgot');
        })
        .catch((err) => {
          res.json({ err: "Mail not sent" });
        });
    })
    .catch((err) => {
      res.json({ err: "User not found" });
    });
});
//Get user profile details

router.get("/profile", middleware.isUser, (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json({ err: err }));
});
//===========================================================================
//get user profile by id
router.get("/profile/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json({ err: err }));
});

// User profile update

router.put("/profile/update/", middleware.isUser, async (req, res) => {
  query = await validationController.UserProfileUpdateBuilder(req);
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: query.update },
    { new: true },
    // the callback function
    (err, todo) => {
      console.log(todo);
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      req.login(todo, (err) => {
        if (err) return res.status(500).send(err);
        return res.send(todo);
      });
      // return res.send(todo);
    }
  );
});

// get user applied jobs
router.get("/applied/jobs",middleware.isUser,(req ,res) =>{
  let job_id=req.user.applied.map(item=>{
    return item.id;
  });
  Job.find({_id:{$in:job_id}},{applicants:0,acceptedApplicants:0,'author.username':0}).then((jobs) =>{
      res.json({jobs:jobs});
  }).catch((err)=>{res.status(400).json({err:"No applied Jobs"})});
});

//get user applied freelance jobs
router.get("/applied/freelance",middleware.isUser,(req ,res) =>{
  let job_id=req.user.appliedFreelance.map(item=>{
    return item.id;
  });
  Freelance.find({_id:{$in:job_id}},{applicants:0,acceptedApplicants:0,'author.username':0}).then((jobs) =>{
      res.json({jobs:jobs});
  }).catch((err)=>{res.status(400).json({err:"No applied Jobs"})});
});

// request to post jobs
router.post("/request", middleware.isUser, (req, res) => {
  if (
    req.user.jobtier.allowed +
      req.user.freelancetier.allowed +
      req.user.locumtier.allowed !=
    0
  )
    return res.status(400).json({ err: "Already Applied for jobs" });
  if (req.body.endDate) {
    const expiry = new Date(req.body.endDate);
    var days = (expiry - Date.now()) / (1000 * 60 * 60 * 24);
    if (days < 0 || days > 90)
      return res.status(400).send("Invalid time format");
  }
  if (req.body.category == "Job")
    update = {
      jobtier: {
        allowed: 1,
        posted: 1,
        saved: 0,
        closed: 0,
      },
    };
  else if (req.body.category == "Day Job")
    update = {
      freelancetier: {
        allowed: 1,
        posted: 1,
        saved: 0,
        closed: 0,
      },
    };
  else if (req.body.category == "Locum")
    update = {
      locumtier: {
        allowed: 1,
        posted: 1,
        saved: 0,
        closed: 0,
      },
    };
  else return res.status(400).json({ err: "Invalid job type" });
  User.findByIdAndUpdate(req.user._id, { $set: update })
    .then((user) => {
      if (req.body.category == "Job") {
        let job = new Job({
          title: req.body.title,
          profession: req.body.profession,
          specialization: req.body.specialization,
          superSpecialization: req.body.superSpecialization,
          description: req.body.description,
          address: req.body.address,
          createdAt: new Date(),
          createdBy: "User",
          expireAt: expiry,
          validated: user.validated,
          extension: 1,
        });
        Job.create(job)
          .then((job) => {
            job.author.username = req.user.username;
            job.author.id = req.user._id;
            job.author.instituteName = req.user.instituteName;
            job.author.photo = req.user.logo;
            // job.author.about = req.user.description.about;
            console.log(job);
            job
              .save()
              .then((job) => {
                //let sJob= new savedJob()
                let sjob = new savedJob({
                  jobRef: job._id,
                  status: "Active",
                  title: req.body.title,
                  profession: req.body.profession,
                  specialization: req.body.specialization,
                  superSpecialization: req.body.superSpecialization,
                  description: req.body.description,
                  address: req.body.address,
                  createdAt: new Date(),
                  createdBy: "User",
                  expireAt: expiry,
                  validated: user.validated,
                  extension: 1,
                });
                savedJob
                  .create(sjob)
                  .then((sjob) => {
                    User.findById(req.user._id)
                      .then((user) => {
                        (user.jobs = [
                          ...user.jobs,
                          {
                            title: job.title,
                            id: job._id,
                            sid: sjob._id,
                          },
                        ]),
                          //console.log(job);
                          //user.savedJobs[job._id]=job;
                          //  user.savedJobs=[
                          // ...user.savedJobs,sjob._id

                          // ];
                          user
                            .save()
                            .then((updatedUser) => {
                              // try{
                              // 	mailController.jobPostMail(user,job);}
                              // 	catch(err){console.log(err);}
                              res.json({
                                job: job,
                                user: req.user,
                                updatedUser: updatedUser,
                              });
                            })
                            .catch((err) =>
                              res.status(400).json({
                                err: err,
                              })
                            );
                      })
                      .catch((err) => {
                        res.status(400).json({ err: "User not found" });
                      });
                  })
                  .catch((err) =>
                    res.status(400).json({
                      err: err,
                      user: req.user,
                    })
                  );
              })
              .catch((err) => {
                res.status(400).json({ err: "Job not created" });
              });
          })
          .catch((err) =>
            res.status(400).json({
              err: err,
              user: req.user,
            })
          );
      } else {
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
          createdAt: new Date(),
          createdBy: "User",
          expireAt: expiry,
          validated: user.validated,
          extension: 1,
        });
        Freelance.create(freelance)
          .then((job) => {
            job.author.username = req.user.username;
            job.author.id = req.user._id;
            job.author.instituteName = req.user.instituteName;
            job.author.photo = req.user.logo;
            // job.author.about = req.user.description.about;
            //console.log(job);
            job.save().then((job) => {
              console.log(job._id);
              let sfreelance = new savedFreelance({
                jobRef: job._id,
                status: "Active",
                title: req.body.title,
                profession: req.body.profession,
                specialization: req.body.specialization,
                superSpecialization: req.body.superSpecialization,
                description: req.body.description,
                address: req.body.address,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                attachedApplicants: req.body.attachedApplicants,
                createdAt: new Date(),
                createdBy: "User",
                expireAt: expiry,
                validated: user.validated,
                extension: 1,
              });
              savedFreelance
                .create(sfreelance)
                .then((sjob) => {
                  User.findById(req.user._id)
                    .then((user) => {
                      (user.freelanceJobs = [
                        ...user.freelanceJobs,
                        {
                          title: job.title,
                          id: job._id,
                          sid: sjob._id,
                        },
                      ]),
                        // user.savedFreelance=[
                        // 	...user.savedFreelance,sjob._id
                        // 	];
                        user
                          .save()
                          .then((updatedUser) =>
                            res.json({
                              job: job,
                              user: req.user,
                              updatedUser: updatedUser,
                            })
                          )
                          .catch((err) =>
                            res.status(400).json({
                              err: err,
                            })
                          );
                    })
                    .catch((err) => {
                      res.status(400).json({ err: "User not found" });
                    });
                })
                .catch((err) =>
                  res.status(400).json({
                    err: err,
                    user: req.user,
                  })
                );
            });
          })
          .catch((err) => {
            res.status(400).json({ err: "Job not saved" });
          });
      }
    })
    .catch((err) => {
      res.status(400).json({ err: "User not found" });
    }); //  }).catch((err)=>{res.status(400).json({err:"User not found"})});
});


//get multiple jobs
router.get("/all/jobs", middleware.isUser, (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      const id = user.jobs.map((job) => {
        return job.id;
      });
      console.log(id);
      Job.find({ _id: { $in: id } })
        .then((jobs) => {
          res.json({ jobs: jobs });
        })
        .catch((err) => {
          res.json({ err: "Jobs not found" });
        });
    })
    .catch((err) => {
      res.json({ err: "User not found" });
    });
});

//get multiple freelance jobs
router.get("/all/freelance", middleware.isUser, (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      const id = user.freelanceJobs.map((job) => {
        return job.id;
      });
      console.log(id);
      Freelance.find({ _id: { $in: id } })
        .then((jobs) => {
          res.json({ jobs: jobs });
        })
        .catch((err) => {
          res.json({ err: "Jobs not found" });
        });
    })
    .catch((err) => {
      res.json({ err: "User not found" });
    });
});

// get multiple saved jobs
router.get("/all/savedJobs", middleware.isUser, (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      const ID = user.savedJobs.map((item) => {
        return mongoose.Types.ObjectId(item.id);
      });
      savedJob
        .find({ _id: { $in: ID } })
        .then((jobs) => {
          res.json({ jobs: jobs });
        })
        .catch((err) => {
          res.json({ err: "Jobs not found" });
        });
    })
    .catch((err) => {
      res.json({ err: "User not found" });
    });
});

//  get multiple saved freelance jobs
router.get("/all/savedFreelance", middleware.isUser, (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      const ID = user.savedFreelance.map((item) => {
        return mongoose.Types.ObjectId(item.id);
      });
      console.log(ID);
      savedFreelance
        .find({ _id: { $in: ID } })
        .then((jobs) => {
          res.json({ jobs: jobs });
        })
        .catch((err) => {
          res.json({ err: "Jobs not found" });
        });
    })
    .catch((err) => {
      res.json({ err: "User not found" });
    });
});
// get expired jobs
router.get("/all/expiredJobs", middleware.isUser, (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      const ID = user.jobs.map((item) => {
        return mongoose.Types.ObjectId(item.id);
      });
      console.log(ID);
      var active = [];
      var inactive = [];
      let promises = [];
      for (let i = 0; i < ID.length; i++) {
        promises.push(
          new Promise((resolve, reject) => {
            const id = ID[i];
            Job.findById(id)
              .then((job) => {
                if (job == null) inactive.push(id);
                else active.push(id);
                resolve("Done");
              })
              .catch((err) => {
                inactive.push(id);
                resolve("Done");
              });
          })
        );
      }
      Promise.all(promises)
        .then((msg) => {
          console.log(inactive);
          savedJob
            .find({ jobRef: { $in: inactive } })
            .then((jobs) => {
              res.json({ jobs: jobs });
            })
            .catch((err) => {
              res.json({ err: "Error finding expired jobs" });
            });
        })
        .catch((err) => res.json({ err: "Couldn't find expired jobs" }));
    })
    .catch((err) => res.json({ err: "Couldn't find User" }));
});
// get expired freelance jobs
router.get("/all/expiredFreelance", middleware.isUser, (req, res) => {
  console.log(req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      const ID = user.freelanceJobs.map((item) => {
        return mongoose.Types.ObjectId(item.id);
      });
      var active = [];
      var inactive = [];
      let promises = [];
      for (let i = 0; i < ID.length; i++) {
        promises.push(
          new Promise((resolve, reject) => {
            const id = ID[i];
            Freelance.findById(id)
              .then((job) => {
                if (job == null) inactive.push(id);
                else active.push(id);
                resolve("Done");
              })
              .catch((err) => {
                inactive.push(id);
                resolve("Done");
              });
          })
        );
      }
      Promise.all(promises)
        .then((msg) => {
          console.log(inactive);
          savedFreelance
            .find({ jobRef: { $in: inactive } })
            .then((jobs) => {
              res.json({ jobs: jobs });
            })
            .catch((err) => {
              res.json({ err: "Error finding expired jobs" });
            });
        })
        .catch((err) => res.json({ err: "Couldn't find expired jobs" }));
    })
    .catch((err) => res.json({ err: "Couldn't find user" }));
});
//get saved job
router.get("/save/job/:id", middleware.isUser, (req, res) => {
  savedJob
    .findById(req.params.id)
    .then((job) => {
      res.json(job);
    })
    .catch((err) => res.status(400).json({ err: "Job not found" }));
});
//get saved freelance job
router.get("/save/freelance/:id", middleware.isUser, (req, res) => {
  savedFreelance
    .findById(req.params.id)
    .then((job) => {
      res.json(job);
    })
    .catch((err) => res.status(400).json({ err: "Job not found" }));
});
//get a job by id
router.get("/post/job/:id", (req, res) => {
  Job.findById(req.params.id)
    .then((job) => {
      res.json(job);
    })
    .catch((err) => res.status(400).json({ err: err }));
});
//get a freelance job by id
router.get("/post/freelance/:id", (req, res) => {
  Freelance.findById(req.params.id)
    .then((job) => {
      res.json(job);
    })
    .catch((err) => res.status(400).json({ err: err }));
});

//delete a job

router.delete("/post/job/:id", middleware.checkJobOwnership, (req, res) => {
  Job.findByIdAndDelete(req.params.id)
    .then(() => res.json("Job deleted successfully !"))
    .catch((err) =>
      res.status(400).json({
        err: err,
      })
    );
});
//delete a job

router.delete("/save/job/:id", middleware.isUser, (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user.savedJobs.includes(req.params.id))
        savedJob
          .findByIdAndDelete(req.params.id)
          .then(() => res.json("Saved Job deleted successfully !"))
          .catch((err) =>
            res.status(400).json({
              err: err,
            })
          );
    })
    .catch((err) => {
      res.json({ err: "Job doesn't belong to you" });
    });
});
//delete a job

router.delete(
  "/post/freelance/:id",
  middleware.checkFreelanceJobOwnership,
  (req, res) => {
    Freelance.findByIdAndDelete(req.params.id)
      .then(() => res.json("Freelance Job deleted successfully !"))
      .catch((err) =>
        res.status(400).json({
          err: err,
        })
      );
  }
);
//delete a job

router.delete("/save/freelance/:id", middleware.isUser, (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user.savedJobs.includes(req.params.id))
        savedFreelance
          .findByIdAndDelete(req.params.id)
          .then(() => res.json("Saved Freelance Job deleted successfully !"))
          .catch((err) =>
            res.status(400).json({
              err: err,
            })
          );
    })
    .catch((err) => {
      res.json({ err: "Job doesn't belong to you" });
    });
});
module.exports = router;
/*
    "username":"sparshjain",
    "password":"sparsh@123"

    "title": "Second Blog",
    "image": "",
    "body": "this is second blog"

*/
