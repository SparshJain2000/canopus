const { search } = require("./admin.router");
const { searchController } = require("../controllers/search.controller");
const mailController = require("../controllers/mail.controller");
const { query: q } = require("express");
const employerModel = require("../models/employer.model");
const mongoose = require("mongoose");
const Email = require("email-templates");
require("dotenv").config();
const admin = process.env.ADMIN_MAIL;
const path=require('path');
const router = require("express").Router(),
    passport = require("passport"),
	middleware = require("../middleware/index"),
	User = require("../models/user.model"),
    Job = require("../models/job.model"),
    Freelance = require("../models/freelance.model"),
    Employer = require("../models/employer.model"),
	savedJob =require("../models/savedJobs.model"),
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
            saved:0,
            closed: 0,
        },
        freelancetier:{
            allowed:3,
            posted:0,
            saved:0,
            closed:0,
        },
        locumtier:{
            allowed:1,
            posted:0,
            saved:0,
            closed:0,
        },
		sponsors:{
			allowed:10,
			posted:0
		},
        validated: false,
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
            return res.json({
                employer: req.user,
                message: `${req.user.username} Logged in`,
            });
        });
    })(req, res, next);
});
//===========================================================================
router.post('/forgot', async (req, res, next) => {
    const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
    Employer.findOneAndUpdate({username:req.body.username},{$set:{resetPasswordToken:token,resetPasswordExpires:Date.now()+3600000}}).then((user)=>{;
	console.log(token);
	mailController.forgotMail(req,user,token);
    res.json({status:"Email has been sent"});
    //res.redirect('/forgot');
//}).catch((err)=>{res.json({err:"User not saved"})});
    }).catch((err)=>{res.json({err:"User not found"})});
});

router.post('/reset/:token', async (req, res) => {
    Employer.findOne({resetPasswordToken:req.params.token}).then((user)=>{
      if(user.resetPasswordExpires>Date.now() &&
      crypto.timingSafeEqual(Buffer.from(user.resetPasswordToken), Buffer.from(req.params.token)))

       // console.log(user);
    // if (!user) {
    //   req.flash('error', 'Password reset token is invalid or has expired.');
    //   return res.redirect('/forgot');
    // }  
    user.setPassword(req.body.password).then((user)=>{
        //user.save();
        user.save().then((user)=>{
            Employer.findOneAndUpdate({resetPasswordToken:req.params.token},{$unset:{resetPasswordToken:1,resetPasswordExpires:1}}).then((user)=>{
        const resetEmail = {
            to: user.username,
            from: 'postmaster@sandboxa6c1b3d7a13a4122aaa846d7cd3f96a2.mailgun.org',
            subject: 'Your password has been changed',
            text: `
              This is a confirmation that the password for your account "${user.username}" has just been changed.
            `,
          };
          mailController.transport.sendMail(resetEmail);
          res.json({status:"Updated"});
        }).catch((err)=>{res.status(400).json({err:"Fields not unset"})});
        }).catch((err)=>{res.status(400).json({err:"Password not saved"})});
    }).catch((err)=>{res.status(400).json({err:"Password not set"})});
  //req.flash('success', `Success! Your password has been changed.`);
 
  }).catch((err)=>{res.json({err:"User not found"})});
});
//Logout route
router.get("/logout", (req, res) => {
    req.logout();
    res.json({ message: "Logged Out" });
});
router.get("/current", (req, res) => {
    res.json({ user: req.user });
});
//===========================================================================
//Get all the jobs offered by employer
const getJobs = (id) => {
    return new Promise((resolve, reject) => {
        // let jobs = [];

        Job.findById(id)
            .then((job) => {
                // jobs = [...jobs, job];
                resolve(job);
            })
            .catch((err) => reject(err));

        // resolve(jobs);
    });
};
router.get("/jobs", middleware.isEmployer, (req, res) => {
    Employer.findById(req.user._id).then((employer) => {
        let jobs = [];
        employer.jobs.forEach((job) => {
            jobs.push(getJobs(job.id));
        });
        // getJobs(employer)
        //     .then((jobs) => res.json(jobs))
        //     .catch((err) => res.status(400).json({ err: err }));
        Promise.all(jobs)
            .then((allJobs) => {
                res.json(allJobs);
            })
            .catch((err) => res.status(400).json({ err: err }));
    });
});
//get all freelance jobs
const getFreelanceJobs = (id) => {
    return new Promise((resolve, reject) => {
        // let jobs = [];

        Freelance.findById(id)
            .then((job) => {
                // jobs = [...jobs, job];
                resolve(job);
            })
            .catch((err) => reject(err));

        // resolve(jobs);
    });
};
router.get("/freelance", middleware.isEmployer, (req, res) => {
    Employer.findById(req.user._id).then((employer) => {
        let jobs = [];
        employer.freelanceJobs.forEach((job) => {
            jobs.push(getFreelanceJobs(job.id));
        });
        // getJobs(employer)
        //     .then((jobs) => res.json(jobs))
        //     .catch((err) => res.status(400).json({ err: err }));
        Promise.all(jobs)
            .then((allJobs) => {
                res.json(allJobs);
            })
            .catch((err) => res.status(400).json({ err: err }));
    });
});
// Find active Jobs
router.post("/active", middleware.isEmployer, (req, res) => {
    const ID = req.body.id;
    var active = [];
    var inactive = [];
    let promises = [];
    for (let i = 0; i < ID.length; i++) {
        promises.push(
            new Promise((resolve, reject) => {
                const id = ID[i];
                Job.findById(id)
                    .then((job) => {
                        active.push(id);
                        resolve("Done");
                        // console.log(active)
                    })
                    .catch((err) => {
                        inactive.push(id);
                        resolve("Done");
                    });
            }),
        );
    }
    Promise.all(promises)
        .then((msg) => {
            res.send({ active: active, inactive: inactive });
        })
        .catch((err) => res.send({ active: active, inactive: inactive }));
});

//===========================================================================
//Get employer details

router.get("/profile", middleware.isEmployer, (req, res) => {
    Employer.findById(req.user._id)
        .then((employer) => res.json(employer))
        .catch((err) => res.status(400).json({ err: err }));
});

//===========================================================================
// Employer profile update

router.put("/profile/update/", middleware.isEmployer, (req, res) => {
    const user = new Employer({
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.address && {
            address: {
                pin: req.body.address.pin,
                city: req.body.address.city,
                state: req.body.address.state,
            },
        }),
    });
    Employer.findByIdAndUpdate(
        // the id of the item to find
        req.employer._id,
        req.body,
        { new: true },

        // the callback function
        (err, todo) => {
            // Handle any possible database errors
            if (err) return res.status(500).send(err);
            return res.send(todo);
        },
    );
});

router.put("/apply/job/:id",middleware.checkJobOwnership, (req,res)=>{
    User.findById(req.body.id).then((user) =>{
		Job.findById(req.params.id).then((job)=>{
			if(job.description.count-job.acceptedApplicants.length==0)
			return res.status(400).json({err:"Wrong Employer"});
			const ids=job.acceptedApplicants.map(item=>{
				return item.id;
			})
			if(ids.includes(req.body.id))
			return res.status(400).json({err:"Candidate already accepted"});
			job.acceptedApplicants=[
				...job.acceptedApplicants,
				{
					id:user._id,
					name:`${user.salutation} ${user.firstName} ${user.lastName}`,
					image:user.image,
					username:user.username,
					phone:user.phone
				}
			],
			job.save().then((updatedJob)=>{
					savedJob.findOne({jobRef:req.params.id}).then((sjob)=>{
						sjob.acceptedApplicants=[
							...sjob.acceptedApplicants,
							{
								id:user._id,
								name:`${user.salutation} ${user.firstName} ${user.lastName}`,
								image:user.image,
								username:user.username,
								phone:user.phone
							}
						],
						sjob.save().then((updatedsjob)=>{
					if(updatedJob.description.number-updatedJob.acceptedApplicants.length==0){
						Job.deleteOne({_id:req.params.id});
						res.json({status:"Candidate Accepted and Job closed"})
					}
					else
					res.json({status:"Candidate Accepted"});
					}).catch((err)=>{res.status(400).json({err:"Job not saved"})});
				}).catch((err) => { res.status(400).json({err:"Saved Job not found"})});
			}).catch((err) => { res.status(400).json({err:"Wrong Employer"})});
		}).catch((err) => { res.status(400).json({err:"Wrong Job Id"})});
    }).catch((err) => { res.status(400).json({err:"Wrong user"})});
});

// Accept an day job applicant 
router.put("/apply/freelance/:id",middleware.checkFreelanceJobOwnership, (req,res)=>{
    User.findById(req.body.id).then((user) =>{
		Freelance.findById(req.params.id).then((freelance)=>{
			if(freelance.description.count-freelance.acceptedApplicants.length==0)
			return res.status(400).json({err:"Wrong Employer"});
			const ids=freelance.acceptedApplicants.map(item=>{
				return item.id;
			})
			if(ids.includes(req.body.id))
			return res.status(400).json({err:"Candidate already accepted"});
			freelance.acceptedApplicants=[
				...freelance.acceptedApplicants,
				{
					id:user._id,
					name:`${user.salutation} ${user.firstName} ${user.lastName}`,
					image:user.image,
					username:user.username,
					phone:user.phone
				}
			],
			freelance.save().then((freelance)=>{
				savedFreelance.findOne({jobRef:req.params.id}).then((sjob)=>{
					sjob.acceptedApplicants=[
						...sjob.acceptedApplicants,
						{
							id:user._id,
							name:`${user.salutation} ${user.firstName} ${user.lastName}`,
							image:user.image,
							username:user.username,
							phone:user.phone
						}
					],
					sjob.save().then((updatedsjob)=>{
				Employer.findById(req.user._id).then((employer)=>{
					employer.acceptedApplicants=[
						{
							id:user._id,
							name:`${user.salutation} ${user.firstName} ${user.lastName}`,
							image:user.image,
							username:user.username,
							phone:user.phone
						}
					],
				employer.save().then((employer)=>{
					if(freelance.description.number-freelance.acceptedApplicants.length==0){
						Freelance.deleteOne({_id:req.params.id});
						res.json({status:"Candidate Accepted and Job closed"})
					}
					else
					res.json({status:"Candidate Accepted"});
					}).catch((err)=>{res.status(400).json({err:"Employer not updated"})});
				}).catch((err)=>{res.status(400).json({err:"Job not saved"})});
			}).catch((err) => { res.status(400).json({err:"Saved Job not found"})});
				}).catch((err) => { res.status(400).json({err:"Job not updated"})});
			}).catch((err) => { res.status(400).json({err:"Wrong Employer"})});
		}).catch((err) => { res.status(400).json({err:"Wrong Job Id"})});
    }).catch((err) => { res.status(400).json({err:"Wrong user"})});
});
//sponsor a job
router.put("/sponsor/job/:id",middleware.checkJobOwnership,(req,res)=>{
	Employer.findById(req.user._id).then((employer)=>{
		const Id=employer.jobs.map(item=>{
			return mongoose.Types.ObjectId(item.id);
		});
	   if(!Id.includes(req.params.id))
	   return res.status(400).json({err:"Incorrect job ID"});
	   if(employer.sponsors.allowed-employer.sponsors.posted<=0)
	   return res.status(400).json({err:"No sponsors remaining"});
	   Employer.findByIdAndUpdate(req.user._id,{$inc:{'sponsors.posted':1}}).then((employer)=>{
		   Job.findByIdAndUpdate(req.params.id,{$set:{sponsored:true}}).then((job)=>{
			   res.json({job:job});
		   }).catch((err)=>{res.status(400).json({err:"Job not updated"})});
	   }).catch((err)=>{res.status(400).json({err:"Employer not found"})});
	}).catch((err)=>{res.status(400).json({err:"Employer not found"})});
});

router.put("/sponsor/freelance/:id",middleware.checkFreelanceJobOwnership,(req,res)=>{
   Employer.findById(req.user._id).then((employer)=>{
	   const Id=employer.freelanceJobs.map(item=>{
		   return mongoose.Types.ObjectId(item.id);
	   });
	  if(!Id.includes(req.params.id))
	  return res.status(400).json({err:"Incorrect job ID"});
	  if(employer.sponsors.allowed-employer.sponsors.posted<=0)
	  return res.status(400).json({err:"No sponsors remaining"});
	  Employer.findByIdAndUpdate(req.user._id,{$inc:{'sponsors.posted':1}}).then((employer)=>{
		  Freelance.findByIdAndUpdate(req.params.id,{$set:{sponsored:true}}).then((job)=>{
			  res.json({job:job});
		  }).catch((err)=>{res.status(400).json({err:"Job not updated"})});
	  }).catch((err)=>{res.status(400).json({err:"Employer not found"})});
   }).catch((err)=>{res.status(400).json({err:"Employer not found"})});
});
//Job related stuff starts here
//post a job
router.post("/post/job", middleware.isEmployer, (req, res) => {
    const expiry=new Date(req.body.expireAt);
    var days=(expiry-Date.now())/(1000*60*60*24);
    if(days<0 || days>90 )
    return res.status(400).json({err:"Invalid time format"});
    else
    Employer.findById(req.user._id).then((employer) => {
		//validation
		if(employer.validated==false && employer.jobtier.posted>0)
		return res.status(400).json({err:"You can only post one Job until you are validated"});
		if(employer.jobtier.allowed-employer.jobtier.posted<=0)
		return res.status(400).json({err:"Max Jobs Posted"});
		else Employer.findByIdAndUpdate(req.user._id,{$inc:{"jobtier.posted":1}}).then((employer2)=>{
	let job = new Job({
		title: req.body.title,
		profession: req.body.profession,
        specialization: req.body.specialization,
        superSpecialization:req.body.superSpecialization,
		description: req.body.description,
		address: req.body.address,
        createdAt:new Date(),
        createdBy:"Employer",
		expireAt:expiry,
		validated:employer.validated,
	});
	Job.create(job)
	.then((job) => {
		job.author.username = req.user.username;
		job.author.id = req.user._id;
		console.log(job);
		job.save()
		.then((job) => {
			//let sJob= new savedJob()
			let sjob = new savedJob({
				jobRef:job._id,
				status:"Active",
				title: req.body.title,
				profession: req.body.profession,
				specialization: req.body.specialization,
                superSpecialization:req.body.superSpecialization,
				description: req.body.description,
				address: req.body.address,
                createdAt:new Date(),
                createdBy:"Employer",
				expireAt:expiry,
				validated:employer.validated,
			});
			savedJob.create(sjob).then((sjob) =>{
			Employer.findById(req.user._id).then((employer) => {
			
				employer.jobs = [
				...employer.jobs,
				{
					title: job.title,
					id: job._id,
					sid:sjob._id,
				},
				],
				//console.log(job);
				//employer.savedJobs[job._id]=job;
				//  employer.savedJobs=[
				// ...employer.savedJobs,sjob._id
				
				// ];
				employer
				.save()
				.then((updatedEmployer) =>{
					// try{
					// 	mailController.jobPostMail(employer,job);}
					// 	catch(err){console.log(err);}
				      res.json({
				      	job: job,
				      	user: req.user,
				      	updatedEmployer: updatedEmployer,
				      });
					 } )
				.catch((err) =>
				       res.status(400).json({
				       	err: err,
				       }),
				       );
			}).catch((err) => {res.status(400).json({err:"Employer not found"})});
		}).catch((err) =>
		       res.status(400).json({
		       	err: err,
		       	user: req.user,
		       }),
		       );
	
			}).catch((err) => {res.status(400).json({err:"Job not created"})});
		})
	})
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       	user: req.user,
	       }),
	       )
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       	user: req.user,
	       }),
		   );
		}).catch((err)=>{res.status(400).json({err:err})});

});

// Post freelance job
router.post("/post/freelance", middleware.isEmployer, (req, res) => {
    const expiry=new Date(req.body.endDate);
    var days=(expiry-Date.now())/(1000*60*60*24);
    if(days<0 || days>30 )
    return res.status(400).json({err:"Invalid time format"});
    else
    Employer.findById(req.user._id).then((employer) => { 
		var update={};
		if(employer.validated==false && employer.freelancetier.posted>0)
		return res.status(400).json({err:"You can only post one Job until you are validated"});
        if(req.body.category=="Day Job"){
		if(employer.freelancetier.allowed-employer.freelancetier.posted<=0)
        return res.status(400).json({err:"Max Jobs Posted"});
            update={"freelancetier.posted":1};
        }
        else if (req.body.category=="Locum"){
            if(user.locumtier.allowed-user.locumtier.posted<=0)
            return res.status(400).json({err:"Max Jobs Posted"});
                update={"locumtier.posted":1};
            }
            else 
            return res.status(400).json({err:"Invalid job type"});
		Employer.findByIdAndUpdate(req.user._id,{$inc:update}).then((employer2) =>{
	let freelance = new Freelance({
		title: req.body.title,
		profession: req.body.profession,
		specialization: req.body.specialization,
        superSpecialization:req.body.superSpecialization,
		description: req.body.description,
		address: req.body.address,
		startDate:req.body.startDate,
		endDate:req.body.endDate,
        createdAt:new Date(),
        createdBy:"Employer",
		expireAt:expiry,
		validated:employer.validated,
	});
	Freelance.create(freelance)
	.then((job) => {
		job.author.username = req.user.username;
		job.author.id = req.user._id;
		//console.log(job);
		job.save()
		.then((job) => {
			console.log(job._id);
			let sfreelance = new savedFreelance({
				jobRef:job._id,
				status:"Active",
				title: req.body.title,
				profession: req.body.profession,
				specialization: req.body.specialization,
                superSpecialization:req.body.superSpecialization,
				description: req.body.description,
				address: req.body.address,
				startDate:req.body.startDate,
				endDate:req.body.endDate,
                createdAt:new Date(),
                createdBy:"Employer",
				expireAt:expiry,
				validated:employer.validated,
			});
			savedFreelance.create(sfreelance).then((sjob) =>{
			Employer.findById(req.user._id).then((employer) => {
				employer.freelanceJobs = [
				...employer.freelanceJobs,
				{
					title: job.title,
					id: job._id,
					sid:sjob._id,
				},
				],
				// employer.savedFreelance=[
				// 	...employer.savedFreelance,sjob._id
				// 	];
				employer
				.save()
				.then((updatedEmployer) =>
				      res.json({
				      	job: job,
				      	user: req.user,
				      	updatedEmployer: updatedEmployer,
				      }),
				      )
				.catch((err) =>
				       res.status(400).json({
				       	err: err,
				       }),
				       );
			}).catch((err) => {res.status(400).json({err:"Employer not found"})});;
		})
		.catch((err) =>
		       res.status(400).json({
		       	err: err,
		       	user: req.user,
		       }),
		       );
		})
	}).catch((err) => {res.status(400).json({err:"Job not saved"})});
	})
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       	user: req.user,
	       }),
	       )
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       	user: req.user,
	       }),
		   );
		}).catch((err)=> res.status(400).json({err:err}));
});

//save a job
router.post("/save/job", middleware.isEmployer, (req, res) => {
    const expiry=new Date(req.body.expireAt);
    var days=(expiry-Date.now())/(1000*60*60*24);
    if(days<0 || days>90 )
   return res.status(400).json({err:"Invalid time format"});
	Employer.findById(req.user._id).then((employer) => {
        //validation
		if(employer.jobtier.allowed-employer.jobtier.saved<=0)
		return res.status(400).send("Max Jobs Saved");
		else Employer.findByIdAndUpdate(req.user._id,{$inc:{"jobtier.saved":1}}).then((employer2)=>{
	let job = new savedJob({
		status:"Saved",
		title: req.body.title,
		profession: req.body.profession,
		specialization: req.body.specialization,
        superSpecialization:req.body.superSpecialization,
		description: req.body.description,
		address: req.body.address,
        createdAt:new Date(),
        createdBy:"Employer",
		expireAt:expiry,
		validated:employer.validated,
	});
	savedJob.create(job)
	.then((job) => {
		job.author.username = req.user.username;
		job.author.id = req.user._id;
		console.log(job);
		job.save()
		.then((job) => {
			console.log(job);
			Employer.findById(req.user._id).then((employer) => {
			
				//console.log(job);
				//employer.savedJobs[job._id]=job;
				employer.savedJobs=[
				...employer.savedJobs,job._id
				
				];
				employer
				.save()
				.then((updatedEmployer) =>{
					
				      res.json({
				      	job: job,
				      	user: req.user,
				      	updatedEmployer: updatedEmployer,
				      });
					})
				.catch((err) =>
				       res.status(400).json({
				       	err: err,
				       }),
				       );
			}).catch((err) => {res.status(400).json({err:"Employer not found"})});
		}).catch((err) =>
		       res.status(400).json({
		       	err: err,
		       	user: req.user,
		       }),
		       );
	
		//	}).catch((err) => {res.status(400).json({err:"Job not created"})});
		})
	})
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       	user: req.user,
	       }),
	       )
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       	user: req.user,
	       }),
		   );
		}).catch((err)=>{res.status(400).json({err:err})});
});

// Save freelance job
router.post("/save/freelance", middleware.isEmployer, (req, res) => {
    const expiry=new Date(req.body.endDate);
			var days=(expiry-Date.now())/(1000*60*60*24);
            if(days<0 || days>30 )
            return res.status(400).json({err:"Invalid time format"});
    Employer.findById(req.user._id).then((employer) => {
            var update={};
            if(req.body.category=="Day Job"){
            if(employer.freelancetier.allowed-employer.freelancetier.posted<=0)
            return res.status(400).json({err:"Max Jobs Posted"});
                update={"freelancetier.saved":1};
            }
            else if(req.body.category=="Locum"){
            if(employer.locumtier.allowed-employer.locumtier.posted<=0)
            return res.status(400).json({err:"Max Jobs Posted"});
                update={"locumtier.saved":1};
            }
            else 
            return res.status(400).json({err:"Invalid job type"});
		Employer.findByIdAndUpdate(req.user._id,{$inc:update}).then((employer2) =>{
	let freelance = new savedFreelance({
		status:"Saved",
		title: req.body.title,
		profession: req.body.profession,
		specialization: req.body.specialization,
        superSpecialization:req.body.superSpecialization,
		description: req.body.description,
		address: req.body.address,
		startDate:req.body.startDate,
        endDate:expiry,
        createdAt:new Date(),
        createdBy:"Employer",
		expireAt:expiry,
		validated:employer.validated,
	});
	savedFreelance.create(freelance)
	.then((job) => {
		job.author.username = req.user.username;
		job.author.id = req.user._id;
		console.log(job);
		job.save()
		.then((job) => {
			Employer.findById(req.user._id).then((employer) => {
				employer.savedFreelance=[
					...employer.savedFreelance,job._id
					];
				employer
				.save()
				.then((updatedEmployer) =>
				      res.json({
				      	job: job,
				      	user: req.user,
				      	updatedEmployer: updatedEmployer,
				      }),
				      )
				.catch((err) =>
				       res.status(400).json({
				       	err: err,
				       }),
				       );
			}).catch((err) => {res.status(400).json({err:"Employer not found"})});;
		
		})
	}).catch((err) => {res.status(400).json({err:"Job not saved"})});
	})
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       	user: req.user,
	       }),
	       )
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       	user: req.user,
	       }),
		   );
		}).catch((err)=> res.status(400).json({err:err}));
});

//validate a saved job
router.put("/save/job/activate/:id",middleware.isEmployer, (req,res) =>{
	Employer.findById(req.user._id).then((employer)=>{
        if(!employer.savedJobs.includes(req.params.id))
        return res.status(400).json({err:"Wrong job ID"});
		savedJob.findById(req.params.id).then( (sjob) =>{
			const expiry=sjob.expireAt;
			var days=(expiry-Date.now())/(1000*60*60*24);
			if(days<0 || days>90 )
            return res.status(400).send("Invalid time range spcified");
            if(employer.jobtier.allowed-employer.jobtier.saved<=0)
		return res.status(400).send("Max Jobs Saved");
		else Employer.findByIdAndUpdate(req.user._id,{$inc:{"jobtier.posted":1},$inc:{"jobtier.saved":-1}}).then((employer2)=>{
				let job = new Job({
					author:sjob.author,
					title: sjob.title,
					profession: sjob.profession,
					specialization: sjob.specialization,
                    superSpecialization:sjob.superSpecialization,
					description: sjob.description,
					address: sjob.address,
					createdAt:new Date(),
					expireAt:sjob.expiry,
					validated:employer.validated,
				});
				//console.log(job);
				job.save().then((job)=> {
					//console.log(job._id);
					employer.jobs = [
					...employer.jobs,
					{
						title: job.title,
						id: job._id,
						sid:sjob._id,
					},
					];
					employer.savedJobs.splice (employer.savedJobs.indexOf(sjob._id),1);
					employer.save().then((employer)=>{
						sjob.jobRef=job._id;
						sjob.status="Active";
						sjob.createdAt=new Date;
						sjob.expireAt=expiry;
						sjob.save().then((sjob)=>{
							res.status(200).json({updated:"true"})
				}).catch((err)=>{res.status(400).json({err:"Saved job not saved"})});
				}).catch((err)=>{res.status(400).json({err:"Employer not updated"})});
			}).catch((err)=>{res.status(400).json({err:"job not saved"})});
	// Employer.findOne({_id:req.user._id}).then((employer)=>{
		}).catch((err)=>{res.status(400).json({err:"Employer not updated"})});
	}).catch((err)=>{res.status(400).json({err:"Saved Job not found"})});
		// })
	}).catch((err)=>{res.status(400).json({err:"Employer not found"})});
});

//validate a saved freelance job
router.put("/save/freelance/activate/:id",middleware.isEmployer, (req,res) =>{
	Employer.findById(req.user._id).then((employer)=>{
        if(!employer.savedFreelance.includes(req.params.id))
        return res.status(400).json({err:"Wrong job ID"});
		savedFreelance.findById(req.params.id).then( (sjob) =>{
			const expiry=new Date(sjob.endDate);
			var days=(expiry-Date.now())/(1000*60*60*24);
			if(days<0 || days>30 )
            return res.status(400).send("Invalid time range spcified");
            if(employer.freelancetier.allowed-employer.freelancetier.saved<=0)
		return res.status(400).send("Max Jobs Saved");
		else Employer.findByIdAndUpdate(req.user._id,{$inc:{"freelancetier.posted":1},$inc:{"freelancetier.saved":-1}}).then((employer2)=>{
				let job = new Freelance({
					author:sjob.author,
					title: sjob.title,
					profession: sjob.profession,
                    specialization: sjob.specialization,
                    superSpecialization:sjob.superSpecialization,
					description: sjob.description,
					address: sjob.address,
					createdAt:new Date(),
                    startDate:sjob.startDate,
                    createdBy:"Employer",
					expireAt:expiry,
					endDate:expiry,
					validated:employer.validated,
				});
				//console.log(job);
				job.save().then((job)=> {
					//console.log(job._id);
					employer.freelanceJobs = [
					...employer.freelanceJobs,
					{
						title: job.title,
						id: job._id,
						sid:sjob._id,
					},
					];
					employer.savedFreelance.splice (employer.savedFreelance.indexOf(sjob._id),1);
					employer.save().then((employer)=>{
						sjob.jobRef=job._id;
						sjob.status="Active";
						sjob.createdAt=new Date;
						sjob.expireAt=expiry;
						sjob.save().then((sjob)=>{
							res.status(200).json({updated:"true"})
				}).catch((err)=>{res.status(400).json({err:"Saved job not saved"})});
				}).catch((err)=>{res.status(400).json({err:"Employer not updated"})});
			}).catch((err)=>{res.status(400).json({err:"job not saved"})});
	// Employer.findOne({_id:req.user._id}).then((employer)=>{
		}).catch((err)=>{res.status(400).json({err:"Employer tier not updated"})});
	}).catch((err)=>{res.status(400).json({err:"Saved Job not found"})});
		// })
	}).catch((err)=>{res.status(400).json({err:"Employer not found"})});
});
//===========================================================================

//Update a job
router.put("/post/job/:id",middleware.checkJobOwnership,async (req,res) =>{
    var query;
    if(req.body.status=="Active") res.status(400).json({err:"Invalid status"});
		query = await searchController.updateQueryBuilder(req)
	//console.log(query.updateQuery);
	Job.findById(req.params.id).then((job)=>{
	if(req.body.expireAt){
	const expiry=new Date(req.body.expireAt);
		var days=(expiry-job.createdAt)/(1000*60*60*24) ;
		//console.log(days);
		if(days<0 || days>90 )
		res.status(400).json({err:"Invalid time format"});
		else
		query.update["expireAt"]=expiry;
	}
	Job.findOneAndUpdate({_id:req.params.id},{$set:query.update},{new:true}).then((job)=>{	
		console.log(job);
		savedJob.findOneAndUpdate({jobRef:job._id},{$set:query.update}).then((employer)=>{
			res.status(200).json({updated:"true"});
		// employer.save().then((updatedEmployer)=>{
		// res.status(200).json({updated:"true"});
		// }).catch((err)=>{res.status(400).json({err:"Failed to save job"})});
		 }).catch((error)=>{res.status(400).json({err:"Job not updated"})});
		}).catch((error)=>{res.status(400).json({updated:"false"})});
	}).catch((err)=>{res.status(400).json({err:"Couldn't find employer"})});
});
//Update a freelance job
router.put("/post/freelance/:id",middleware.checkFreelanceJobOwnership,async (req,res) =>{
    var query;
    if(req.body.status=="Active") 
    return res.status(400).json({err:"Invalid status"});
		query = await searchController.updateQueryBuilder(req)
	//console.log(query.updateQuery);
	Freelance.findById(req.params.id).then((job)=>{
	if(req.body.startDate) query.update["startDate"]=req.body.startDate;
	if(req.body.endDate) query.update["endDate"]=req.body.endDate;
	const expiry=new Date(req.body.endDate);
		var days=(expiry-job.createdAt)/(1000*60*60*24) ;
		if(days<0 || days>90 )
		return res.status(400).json({err:"Invalid time format"});
		else
		query.update["expireAt"]=expiry;
	// if(req.body.sponsored) {
	// 	query.update["sponsored"]=true;
	// }
	Freelance.findByIdAndUpdate(req.params.id,{$set:query.update}).then((job)=>{	
		savedFreelance.findOneAndUpdate({jobRef:job._id},{$set:query.update}).then((employer)=>{
			res.status(200).json({updated:"true"});
		}).catch((err)=>res.status(400).json({err:"Job not saved"}));
		}).catch((err)=>{res.status(400).json({updated:"false"})});
	}).catch((err)=>{res.status(400).json({err:"Couldn't find employer"})});
});

//Update a saved job
router.put("/save/job/:id",middleware.isEmployer,async (req,res) =>{
    var query; 
    if(req.body.status=="Active") 
    return res.status(400).json({err:"Invalid status"});
		query = await searchController.updateQueryBuilder(req)
	//console.log(query.updateQuery);
	Employer.findById(req.user._id).then((employer)=>{
	if(!employer.savedJobs.includes(req.params.id))
	return res.status(400).json({err:"Invalid Job"});
	savedJob.findById(req.params.id).then((job)=>{
	if(req.body.expireAt){
	const expiry=new Date(req.body.expireAt);
		var days=(expiry-Date.now())/(1000*60*60*24) ;
		//console.log(days);
		if(days<0 || days>90 )
		return res.status(400).json({err:"Invalid time format"});
		else
		query.update["expireAt"]=expiry;
	}

	savedJob.findOneAndUpdate({_id:req.params.id},{$set:query.update},{new:true}).then((job)=>{	
		//console.log(job);
		//savedJob.findOneAndUpdate({jobRef:job._id},{$set:query.update}).then((employer)=>{
			res.status(200).json({updated:"true"});
		// employer.save().then((updatedEmployer)=>{
		// res.status(200).json({updated:"true"});
		// }).catch((err)=>{res.status(400).json({err:"Failed to save job"})});
		 }).catch((error)=>{res.status(400).json({err:"Job not updated"})})
		}).catch((error)=>{res.status(400).json({err:"Couldn't find job"})});
	}).catch((err)=>{res.status(400).json({err:"Couldn't find employer"})});
});

//Update a saved freelance job
router.put("/save/freelance/:id",middleware.isEmployer,async (req,res) =>{
    var query;
    if(req.body.status=="Active") 
    return res.status(400).json({err:"Invalid status"});
		query = await searchController.updateQueryBuilder(req)
	//console.log(query.updateQuery);
	Employer.findById(req.user._id).then((employer)=>{
	if(!employer.savedFreelance.includes(req.params.id))
	return res.status(400).json({err:"Invalid Job"});
	savedFreelance.findById(req.params.id).then((job)=>{
	if(req.body.endDate){
	const expiry=new Date(req.body.endDate);
		var days=(expiry-Date.now())/(1000*60*60*24) ;
		//console.log(days);
		if(days<0 || days>90 )
		return res.status(400).json({err:"Invalid time format"});
		else
		query.update["expireAt"]=expiry;
	}

	savedFreelance.findOneAndUpdate({_id:req.params.id},{$set:query.update},{new:true}).then((job)=>{	
		//console.log(job);
		//savedJob.findOneAndUpdate({jobRef:job._id},{$set:query.update}).then((employer)=>{
			res.status(200).json({updated:"true"});
		// employer.save().then((updatedEmployer)=>{
		// res.status(200).json({updated:"true"});
		// }).catch((err)=>{res.status(400).json({err:"Failed to save job"})});
		 }).catch((error)=>{res.status(400).json({err:"Job not updated"})})
		}).catch((error)=>{res.status(400).json({err:"Couldn't find job"})});
	}).catch((err)=>{res.status(400).json({err:"Couldn't find employer"})});
});


//get multiple jobs
router.get("/all/jobs",middleware.isEmployer,(req,res)=>{
Employer.findById(req.user._id).then((employer)=>{
    const id=employer.jobs.map(job=>{
        return job.id;
    });
    console.log(id);
    Job.find({_id:{$in:id}}).then((jobs)=>{
        res.json({jobs:jobs});
    }).catch((err)=>{res.json({err:"Jobs not found"})});
}).catch((err)=>{res.json({err:"Employer not found"})});
});

//get multiple freelance jobs
router.get("/all/freelance",middleware.isEmployer,(req,res)=>{
Employer.findById(req.user._id).then((employer)=>{
    const id=employer.freelanceJobs.map(job=>{
        return job.id;
    });
    console.log(id);
    Freelance.find({_id:{$in:id}}).then((jobs)=>{
        res.json({jobs:jobs});
    }).catch((err)=>{res.json({err:"Jobs not found"})});
}).catch((err)=>{res.json({err:"Employer not found"})});
});

// get multiple saved jobs
router.get("/all/savedJobs",middleware.isEmployer,(req,res)=>{
Employer.findById(req.user._id).then((employer)=>{
    const ID = employer.savedJobs.map(item=>{
        return mongoose.Types.ObjectId(item.id);
    });
    savedJob.find({_id:{$in:ID}}).then((jobs)=>{
        res.json({jobs:jobs});
    }).catch((err)=>{res.json({err:"Jobs not found"})});
}).catch((err)=>{res.json({err:"Employer not found"})});
});

//  get multiple saved freelance jobs
router.get("/all/savedFreelance",middleware.isEmployer,(req,res)=>{
Employer.findById(req.user._id).then((employer)=>{
    const ID = employer.savedFreelance.map(item=>{
        return mongoose.Types.ObjectId(item.id);
    });
    console.log(ID);
    savedFreelance.find({_id:{$in:ID}}).then((jobs)=>{
        res.json({jobs:jobs});
    }).catch((err)=>{res.json({err:"Jobs not found"})});
}).catch((err)=>{res.json({err:"Employer not found"})});
});
// get expired jobs
router.get("/all/expiredJobs",middleware.isEmployer,(req,res)=>{
Employer.findById(req.user._id).then((employer)=>{
const ID = employer.jobs.map(item=>{
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
                    if(job==null)
                    inactive.push(id);
                    else
                    active.push(id);
                    resolve("Done");
                })
                .catch((err) => {
                    inactive.push(id);
                    resolve("Done");
                });
        }),
    );
}
Promise.all(promises)
    .then((msg) => {
        console.log(inactive);
        savedJob.find({jobRef:{$in:inactive}}).then((jobs)=>{
            res.json({jobs:jobs});
        }).catch((err)=>{res.json({err:"Error finding expired jobs"})});
       
    })
    .catch((err) => res.json({ err:"Couldn't find expired jobs" }));
})
.catch((err) => res.json({ err:"Couldn't find Employer" }));
});
// get expired freelance jobs
router.get("/all/expiredFreelance",middleware.isEmployer,(req,res)=>{
    console.log(req.user._id);
Employer.findById(req.user._id).then((employer)=>{
    const ID = employer.freelanceJobs.map(item=>{
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
                    if(job==null)
                    inactive.push(id);
                    else
                    active.push(id);
                    resolve("Done");
                })
                .catch((err) => {
                    inactive.push(id);
                    resolve("Done");
                });
        }),
    );
}
Promise.all(promises)
    .then((msg) => {
        console.log(inactive);
        savedFreelance.find({jobRef:{$in:inactive}}).then((jobs)=>{
            res.json({jobs:jobs});
        }).catch((err)=>{res.json({err:"Error finding expired jobs"})});
       
    })
    .catch((err) => res.json({ err:"Couldn't find expired jobs" }));
})
.catch((err) => res.json({ err:"Couldn't find employer" }));
});
//get saved job
router.get("/save/job/:id",middleware.isEmployer,(req,res)=>{
savedJob.findById(req.params.id)
.then((job) =>{
    res.json(job);
})
.catch((err) =>res.status(400).json({err:"Job not found"}));
});
//get saved freelance job
router.get("/save/freelance/:id",middleware.isEmployer,(req,res)=>{
savedFreelance.findById(req.params.id)
.then((job) =>{
    res.json(job);
})
.catch((err) =>res.status(400).json({err:"Job not found"}));
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
       }),
       );
});
//delete a job

router.delete("/save/job/:id", middleware.isEmployer, (req, res) => {
    Employer.findById(req.user._id).then((employer)=>{
        if(employer.savedJobs.includes(req.params.id))
            savedJob.findByIdAndDelete(req.params.id)
            .then(() => res.json("Saved Job deleted successfully !"))
            .catch((err) =>
                 res.status(400).json({
                 err: err,
                 }),);
    }).catch((err)=>{res.json({err:"Job doesn't belong to you"})});
});
//delete a job

router.delete("/post/freelance/:id", middleware.checkFreelanceJobOwnership, (req, res) => {
Freelance.findByIdAndDelete(req.params.id)
.then(() => res.json("Freelance Job deleted successfully !"))
.catch((err) =>
       res.status(400).json({
           err: err,
       }),
       );
});
//delete a job

router.delete("/save/freelance/:id", middleware.isEmployer, (req, res) => {
    Employer.findById(req.user._id).then((employer)=>{
        if(employer.savedJobs.includes(req.params.id))
            savedFreelance.findByIdAndDelete(req.params.id)
.then(() => res.json("Saved Freelance Job deleted successfully !"))
.catch((err) =>
       res.status(400).json({
           err: err,
       }),
       );
    }).catch((err)=>{res.json({err:"Job doesn't belong to you"})});
});

module.exports = router;
/*
    "username":"sparshjain",
    "password":"sparsh@123"

    "title": "Second Blog",
    "image": "",
    "body": "this is second blog"

*/
