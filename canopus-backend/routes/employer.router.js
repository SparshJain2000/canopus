const { searchController } = require("../controllers/search.controller");
const { mailController } = require("../controllers/mail.controller");
const {
  validationController,
} = require("../controllers/validation.controller");
const {jobController }= require ( "../controllers/job.controller");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { promisify } = require("util");
const asyncify = require("express-asyncify");
require("dotenv").config();
const GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS;
var ua = require("universal-analytics");
const e = require("express");
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
//===========================================================================
//get all employers
router.route("/").get((req, res) => {
  Employer.find()
    .then((employers) => {
      res.json({
        employers: employers.map((employer) => {
          return { username: employer };
        }),
      });
    })
    .catch((err) => res.status(400).json({ err: err }));
});
//===========================================================================
//Sign up route
router.post("/", (req, res) => {
  const employer = new Employer({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    links: req.body.links,
    description: req.body.description,
    youtube: req.body.youtube,
    role: "Employer",
    jobtier: {
      allowed: 10,
      posted: 0,
      saved: 0,
      closed: 0,
    },
    freelancetier: {
      allowed: 3,
      posted: 0,
      saved: 0,
      closed: 0,
    },
    locumtier: {
      allowed: 1,
      posted: 0,
      saved: 0,
      closed: 0,
    },
    sponsors: {
      allowed: 1,
      posted: 0,
    },
    validated: false,
    createdAt: Date.now(),
  });
  Employer.register(employer, req.body.password)
    .then((employer) => {
      passport.authenticate("employer")(req, res, () => {
        res.json({ employer: employer });
      });
    })
    .catch((err) => res.status(400).json({ err: err }));
});
//===========================================================================
//Login route
// router.post("/login", passport.authenticate("local"), (req, res) => {
//     res.json({ user: req.user, message: `${req.user.username} Logged in` });
// });

router.post("/login", function (req, res, next) {
  passport.authenticate("employer", function (err, employer, info) {
    console.log(info);
    if (err) {
      return res.status(400).json({ err: err });
    }
    if (!employer) {
      return res.status(400).json({ err: info });
    }
    req.logIn(employer, function (err) {
      if (err) {
        return res.status(400).json({ err: err });
      }
      
      // let params = {
      //   ec:"Employer",
      //   ea:"true",
      //   cd1:"employer",
      //   userId:req.user._id
      // };
      // visitor.event(params).send();
      return res.json({
        employer: req.user,
        message: `${req.user.username} Logged in`,
      });
    });
  })(req, res, next);
});
//===========================================================================
router.post("/forgot", async (req, res, next) => {
  const token = (await promisify(crypto.randomBytes)(20)).toString("hex");
  Employer.findOneAndUpdate(
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
      mailController.forgotMail(req, user, token);
      res.json({ status: "Email has been sent" });
      //res.redirect('/forgot');
      //}).catch((err)=>{res.json({err:"User not saved"})});
    })
    .catch((err) => {
      res.json({ err: "User not found" });
    });
});

router.post("/reset/:token", async (req, res) => {
  Employer.findOne({ resetPasswordToken: req.params.token })
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
                Employer.findOneAndUpdate(
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

router.post("/validate", middleware.isEmployer, (req, res) => {});

router.post("/validate/:token", (req, res) => {});
//Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.json({ message: "Logged Out" });
});
router.get("/current", (req, res) => {
  res.json({ user: req.user });
});
//===========================================================================

//===========================================================================
//Get employer details

router.get("/profile", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => res.json(employer))
    .catch((err) => res.status(400).json({ err: err }));
});

//===========================================================================

// public profile get

router.get("/profile/:id", (req, res) => {
  Employer.findOne(
    { _id: req.params.id },
    {
      hash: 0,
      salt: 0,
      jobtier: 0,
      freelancetier: 0,
      locumtier: 0,
      savedJobs: 0,
      savedFreelance: 0,
      username: 0,
      firstName: 0,
      lastName: 0,
    }
  )
    .then((employer) => {
      res.json(employer);
    })
    .catch((err) => {
      res.status(404).json({ err: "Couldn't find employer" });
    });
});

// public jobs
//get multiple jobs
router.get("/profile/:id/jobs", (req, res) => {
  Employer.findById(req.params.id)
    .then((employer) => {
      const id = employer.jobs.map((job) => {
        return job.id;
      });
      console.log(id);
      Job.find({ _id: { $in: id } }, { applicants: 0, acceptedApplicants: 0 })
        .then((jobs) => {
          res.json({ jobs: jobs });
        })
        .catch((err) => {
          res.json({ err: "Jobs not found" });
        });
    })
    .catch((err) => {
      res.json({ err: "Employer not found" });
    });
});

//get multiple freelance jobs
router.get("/profile/:id/freelance", (req, res) => {
  Employer.findById(req.params.id)
    .then((employer) => {
      const id = employer.freelanceJobs.map((job) => {
        return job.id;
      });
      console.log(id);
      Freelance.find(
        { _id: { $in: id } },
        { applicants: 0, acceptedApplicants: 0 }
      )
        .then((jobs) => {
          res.json({ jobs: jobs });
        })
        .catch((err) => {
          res.json({ err: "Jobs not found" });
        });
    })
    .catch((err) => {
      res.json({ err: "Employer not found" });
    });
});
// Employer profile update

router.put("/profile/update/", middleware.isEmployer, async (req, res) => {
  query = await validationController.EmployerProfileUpdateBuilder(req);
  Employer.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: query.update },
    { new: true },
    // the callback function
    (err, employer) => {
      console.log(query.jobUpdate);
      if (
        employer.jobs.length > 0 &&
        (req.body.logo || req.body.instituteName)
      ) {
        const id = employer.jobs.map((item) => {
          return item.id;
        });
        Job.updateMany({ _id: { $in: id } }, { $set: query.jobUpdate })
          .then(() => {
            savedJob
              .updateMany({ jobRef: { $in: id } }, { $set: query.jobUpdate })
              .then(() => {
                console.log("Updated");
              })
              .catch((err) => {
                res.status(500).json({ err: "Saved Job not updated" });
              });
          })
          .catch((err) => {
            res.status(500).json({ err: "Job not updated" });
          });
      } else if (
        employer.freelanceJobs.length > 0 &&
        (req.body.logo || req.body.instituteName)
      ) {
        const id = employer.freelanceJobs.map((item) => {
          return item.id;
        });
        Freelance.updateMany({ _id: { $in: id } }, { $set: query.jobUpdate })
          .then(() => {
            savedFreelance
              .updateMany({ jobRef: { $in: id } }, { $set: query.jobUpdate })
              .then(() => {
                console.log("Updated");
              })
              .catch((err) => {
                res.status(500).json({ err: "Saved Job not updated" });
              });
          })
          .catch((err) => {
            res.status(500).json({ err: "Job not updated" });
          });
      }
      //if(employer.jobs.length)
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      req.login(employer, (err) => {
        if (err) return res.status(500).send(err);
        return res.send(employer);
      });
      // return res.send(todo);
    }
  );
});



//get multiple jobs
router.get("/all/jobs", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      const id = employer.jobs.map((job) => {
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
      res.json({ err: "Employer not found" });
    });
});

//get multiple freelance jobs
router.get("/all/freelance", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      const id = employer.freelanceJobs.map((job) => {
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
      res.json({ err: "Employer not found" });
    });
});

// get multiple saved jobs
router.get("/all/savedJobs", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      const ID = employer.savedJobs.map((item) => {
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
      res.json({ err: "Employer not found" });
    });
});

//  get multiple saved freelance jobs
router.get("/all/savedFreelance", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      const ID = employer.savedFreelance.map((item) => {
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
      res.json({ err: "Employer not found" });
    });
});
// get expired jobs
router.get("/all/expiredJobs", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      const ID = employer.jobs.map((item) => {
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
    .catch((err) => res.json({ err: "Couldn't find Employer" }));
});
// get expired freelance jobs
router.get("/all/expiredFreelance", middleware.isEmployer, (req, res) => {
  console.log(req.user._id);
  Employer.findById(req.user._id)
    .then((employer) => {
      const ID = employer.freelanceJobs.map((item) => {
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
    .catch((err) => res.json({ err: "Couldn't find employer" }));
});
//get saved job
router.get("/save/job/:id", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      const id = employer.jobs.map((item) => {
        //if(item.sid==req.params.id)
        return item.sid;
      });
      if (
        id.includes(req.params.id) ||
        employer.savedJobs.includes(req.params.id)
      )
        savedJob
          .findById(req.params.id)
          .then((job) => {
            res.json(job);
          })
          .catch((err) => res.status(400).json({ err: "Job not found" }));
      else return res.status(400).json({ err: "Job doesn't belong to you" });
    })
    .catch((err) => res.status(400).json({ err: "Not employer" }));
});
//get saved freelance job
router.get("/save/freelance/:id", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      const id = employer.freelanceJobs.map((item) => {
        //if(item.sid==req.params.id)
        return item.sid;
      });
      if (
        id.includes(req.params.id) ||
        employer.savedFreelance.includes(req.params.id)
      )
        //	return res.status(400).json({err:"Job doesnt belong to you"});
        savedFreelance
          .findById(req.params.id)
          .then((job) => {
            res.json(job);
          })
          .catch((err) => res.status(400).json({ err: "Job not found" }));
      else return res.status(400).json({ err: "Job doesnt belong to you" });
    })
    .catch((err) => res.status(400).json({ err: "Not employer" }));
});
//get a job by id
router.get("/post/job/:id", middleware.checkJobOwnership, (req, res) => {
  Job.findById(req.params.id)
    .then((job) => {
      res.json(job);
    })
    .catch((err) => res.status(400).json({ err: err }));
});
//get a freelance job by id
router.get(
  "/post/freelance/:id",
  middleware.checkFreelanceJobOwnership,
  (req, res) => {
    Freelance.findById(req.params.id)
      .then((job) => {
        res.json(job);
      })
      .catch((err) => res.status(400).json({ err: err }));
  }
);

//delete a job

router.delete("/post/job/:id", middleware.checkJobOwnership, (req, res) => {
  // Employer.findById(req.user._id).then((employer)=>{
  // 	const id=employer.jobs.map(item=>{
  // 		if(item.id==req.params.id)
  // 		return item.sid;
  // 	});
  savedJob
    .findOne({ jobRef: req.params.id })
    .then((sjob) => {
      sjob.status = "Closed";
      sjob
        .save()
        .then((sjob) => {
          // 	console.log(id);
          // 	savedJob.findByIdAndDelete(id).then((del)=>{
          Job.findByIdAndDelete(req.params.id) //.then((del)=>{
            // employer.jobs = employer.jobs.filter(job => job.id != req.params.id);
            // 	employer.save()
            .then(() => res.json("Job deleted successfully !"))
            .catch((err) =>
              res.status(400).json({
                err: err,
              })
            );
        })
        .catch((err) => {
          res.json({ err: "Job doesn't belong to you" });
        });
    })
    .catch((err) => {
      res.json({ err: "Job doesn't belong to you" });
    });
  // }).catch((err)=>{res.json({err:"Job doesn't belong to you"})});
});
//delete a job

router.delete("/save/job/:id", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      if (!employer.savedJobs.includes(req.params.id))
        return res
          .status(400)
          .json({ err: "Job doesn't belong to you/ Incorrect job ID" });
      employer.savedJobs.splice(
        employer.savedJobs.indexOf(mongoose.Types.ObjectId(req.params.id)),
        1
      );
      employer.jobtier.saved += -1;
      employer
        .save()
        .then((semployer) => {
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
          res.json({ err: "Error Saving Employer" });
        });
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
    //Employer.findById(req.user._id).then((employer)=>{
    // const id=employer.freelanceJobs.map(item=>{
    // 	if(item.id==req.params.id)
    // 	return item.sid;
    // });
    // console.log(id);
    savedFreelance
      .findOne({ jobRef: req.params.id })
      .then((sjob) => {
        sjob.status = "Closed";
        sjob
          .save()
          .then((sjob) => {
            // savedFreelance.findByIdAndDelete(id).then((del)=>{
            Freelance.findByIdAndDelete(req.params.id) //.then((del)=>{
              //employer.freelanceJobs = employer.freelanceJobs.filter(job => job.id != req.params.id);
              //employer.save()
              .then(() => res.json("Freelance Job deleted successfully !"))
              .catch((err) =>
                res.status(400).json({
                  err: err,
                })
              );
          })
          .catch((err) => {
            res.json({ err: "Job doesn't belong to you" });
          });
      })
      .catch((err) => {
        res.json({ err: "Job doesn't belong to you" });
      });
    // }).catch((err)=>{res.json({err:"Job doesn't belong to you"})});
  }
);
//delete a job

router.delete("/save/freelance/:id", middleware.isEmployer, (req, res) => {
  Employer.findById(req.user._id)
    .then((employer) => {
      if (!employer.savedFreelance.includes(req.params.id))
        return res
          .status(400)
          .json({ err: "Job doesn't belong to you/ Incorrect job ID" });
      employer.savedFreelance.splice(
        employer.savedFreelance.indexOf(mongoose.Types.ObjectId(req.params.id)),
        1
      );
      employer.freelancetier.saved += -1;
      employer
        .save()
        .then((semployer) => {
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
          res.json({ err: "Error Saving Employer" });
        });
    })
    .catch((err) => {
      res.json({ err: "Job doesn't belong to you" });
    });
});

module.exports = router;

