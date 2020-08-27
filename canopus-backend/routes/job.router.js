const { search } = require("./admin.router");
const { searchController } = require("../controllers/search.controller");
const { query: q } = require("express");
const employerModel = require("../models/employer.model");
const mongoose = require("mongoose");

const router = require("express").Router(),
middleware = require("../middleware/index"),
Employer = require("../models/employer.model"),
User = require("../models/user.model"),
Job = require("../models/job.model"),
Freelance = require("../models/freelance.model"),
savedJob= require("../models/savedJobs.model"),
savedFreelance = require("../models/savedFreelance.model");
//===========================================================================
//get all jobs
router.post("/alljobs", (req, res) => {
	 //By default sort by Relevance
	 var sort;
	 sort = {$sort: { score: { $meta: "textScore" }} };
	 if ((req.body.order == "New"))
		 sort = {
			 $sort: {
				 _id: -1,
			 },
		 };
	 if ((req.body.order == "Old"))
		 sort = {
			 $sort: {
				 _id: 1,
			 },
		 };
    skip = parseInt(req.body.skip) || 0;
    limiter = parseInt(req.body.limit) || 10;
    Job.aggregate(
        [
            {
                $group: {
                    _id: null,
                    jobCount: {
                        $sum: 1,
                    },
                },
            },
        ],
        (err, jobNum) => {
            if (err) jobCount = 0;
            else jobCount = jobNum[0];
        },
    );
    Job.aggregate([
        {
            $skip: skip,
        },
        {
            $limit: limiter,
        },
    ])
        .then((jobs) =>
            res.json({
                jobs: jobs,
                count: jobCount,
                user: req.user,
            }),
        )
        .catch((err) =>
            res.status(400).json({
                err: err,
            }),
        );
});
//get all freelance jobs
router.post("/allfreelance", (req, res) => {
	var sort;
	 sort = {$sort: { score: { $meta: "textScore" }} };
	 if ((req.body.order == "New"))
		 sort = {
			 $sort: {
				 _id: -1,
			 },
		 };
	 if ((req.body.order == "Old"))
		 sort = {
			 $sort: {
				 _id: 1,
			 },
		 };
    skip = parseInt(req.body.skip) || 0;
    limiter = parseInt(req.body.limit) || 10;
    Freelance.aggregate(
        [
            {
                $group: {
                    _id: null,
                    jobCount: {
                        $sum: 1,
                    },
                },
            },
        ],
        (err, jobNum) => {
            if (err) jobCount = 0;
            else jobCount = jobNum[0];
        },
    );
    Freelance.aggregate([
        {
            $skip: skip,
        },
        {
            $limit: limiter,
        },
    ])
        .then((jobs) =>
            res.json({
                jobs: jobs,
                count: jobCount,
                user: req.user,
            }),
        )
        .catch((err) =>
            res.status(400).json({
                err: err,
            }),
        );
});
//===========================================================================
//get jobs by user
// router.get("/my", middleware.isLoggedIn, (req, res) => {
//     Job.find()
//         .then((jobs) => {
//             // let userBlogs = [];
//             const userBlogs = jobs.filter(
//                 (job) => job.author.username === req.user.username,
//             );
//             res.json({ jobs: userBlogs, user: req.user });
//         })
//         .catch((err) => res.status(400).json({ err: err }));
// });
//===========================================================================
//post a job
router.post("/", middleware.isEmployer, (req, res) => {
	Employer.findById(req.user._id).then((employer) => {
		//validation
		if(employer.jobtier.allowed-employer.jobtier.posted<=0)
		res.status(400).send("Max Jobs Posted");
		else Employer.findByIdAndUpdate(req.user._id,{$inc:{"jobtier.posted":1}}).then((employer2)=>{
		const expiry=new Date(req.body.expireAt);
		var days=(expiry-Date.now())/(1000*60*60*24);
		if(days<0 || days>90 )
		res.status(400).send("Invalid time format");
	let job = new Job({
		title: req.body.title,
		profession: req.body.profession,
		specialization: req.body.specialization,
		description: req.body.description,
		address: req.body.address,
		createdAt:new Date(),
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
				description: req.body.description,
				address: req.body.address,
				createdAt:new Date(),
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
router.post("/freelance", middleware.isEmployer, (req, res) => {
	Employer.findById(req.user._id).then((employer) => {
		if(employer.freelancetier.allowed-employer.freelancetier.posted<=0)
		res.status(400).json({err:"Max Jobs Posted"});
		else Employer.findByIdAndUpdate(req.user._id,{$inc:{"freelancetier.posted":1}}).then((employer2) =>{
			const expiry=new Date(req.body.endDate);
			var days=(expiry-Date.now())/(1000*60*60*24);
			if(days<0 || days>90 )
			res.status(400).send("Invalid time format");
	let freelance = new Freelance({
		title: req.body.title,
		profession: req.body.profession,
		specialization: req.body.specialization,
		description: req.body.description,
		address: req.body.address,
		startDate:req.body.startDate,
		endDate:req.body.endDate,
		createdAt:new Date(),
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
				description: req.body.description,
				address: req.body.address,
				startDate:req.body.startDate,
				endDate:req.body.endDate,
				createdAt:new Date(),
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
router.post("/saveJob", middleware.isEmployer, (req, res) => {
	Employer.findById(req.user._id).then((employer) => {
		//validation
		if(employer.jobtier.allowed-employer.jobtier.saved<=0)
		res.status(400).send("Max Jobs Saved");
		else Employer.findByIdAndUpdate(req.user._id,{$inc:{"jobtier.saved":1}}).then((employer2)=>{
		const expiry=new Date(req.body.expireAt);
		var days=(expiry-Date.now())/(1000*60*60*24);
		if(days<0 || days>90 )
		res.status(400).send("Invalid time format");
	let job = new savedJob({
		status:"Saved",
		title: req.body.title,
		profession: req.body.profession,
		specialization: req.body.specialization,
		description: req.body.description,
		address: req.body.address,
		createdAt:new Date(),
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
router.post("/saveFreelance", middleware.isEmployer, (req, res) => {
	Employer.findById(req.user._id).then((employer) => {
		if(employer.freelancetier.allowed-employer.freelancetier.posted<=0)
		res.status(400).json({err:"Max Jobs Posted"});
		else Employer.findByIdAndUpdate(req.user._id,{$inc:{"freelancetier.saved":1}}).then((employer2) =>{
			const expiry=new Date(req.body.endDate);
			var days=(expiry-Date.now())/(1000*60*60*24);
			if(days<0 || days>30 )res.status(400).send("Invalid time format");
	let freelance = new savedFreelance({
		status:"Saved",
		title: req.body.title,
		profession: req.body.profession,
		specialization: req.body.specialization,
		description: req.body.description,
		address: req.body.address,
		startDate:req.body.startDate,
		endDate:req.body.endDate,
		createdAt:new Date(),
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
router.put("/saveJob/activate/:id",middleware.isEmployer, (req,res) =>{
	Employer.findById(req.user._id).then((employer)=>{
		if(employer.savedJobs.includes(req.params.id))
		if(employer.jobtier.allowed-employer.jobtier.saved<=0)
		res.status(400).send("Max Jobs Saved");
		else Employer.findByIdAndUpdate(req.user._id,{$inc:{"jobtier.posted":1},$inc:{"jobtier.saved":-1}}).then((employer2)=>{
		savedJob.findById(req.params.id).then( (sjob) =>{
			const expiry=sjob.expireAt;
			var days=(expiry-Date.now())/(1000*60*60*24);
			if(days<0 || days>90 )
			res.status(400).send("Invalid time range spcified");
				let job = new Job({
					author:sjob.author,
					title: sjob.title,
					profession: sjob.profession,
					specialization: sjob.specialization,
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
		}).catch((err)=>{res.status(400).json({err:"Saved job not found"})});
	}).catch((err)=>{res.status(400).json({err:"Employer not updated"})});
		// })
	}).catch((err)=>{res.status(400).json({err:"Employer not found"})});
});

//validate a saved freelance job
router.put("/saveFreelance/activate/:id",middleware.isEmployer, (req,res) =>{
	Employer.findById(req.user._id).then((employer)=>{
		if(employer.savedFreelance.includes(req.params.id))
		if(employer.freelancetier.allowed-employer.freelancetier.saved<=0)
		res.status(400).send("Max Jobs Saved");
		else Employer.findByIdAndUpdate(req.user._id,{$inc:{"jobtier.posted":1},$inc:{"jobtier.saved":-1}}).then((employer2)=>{
		savedFreelance.findById(req.params.id).then( (sjob) =>{
			const expiry=sjob.endDate;
			var days=(expiry-Date.now())/(1000*60*60*24);
			if(days<0 || days>30 )
			res.status(400).send("Invalid time range spcified");
				let job = new Freelance({
					author:sjob.author,
					title: sjob.title,
					profession: sjob.profession,
					specialization: sjob.specialization,
					description: sjob.description,
					address: sjob.address,
					createdAt:new Date(),
					startDate:sjob.startDate,
					expireAt:expiry,
					endDate:sjob.expiry,
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
		}).catch((err)=>{res.status(400).json({err:"Saved job not found"})});
	}).catch((err)=>{res.status(400).json({err:"Employer not updated"})});
		// })
	}).catch((err)=>{res.status(400).json({err:"Employer not found"})});
});
//===========================================================================

//Update a job
router.put("/:id",middleware.checkJobOwnership,async (req,res) =>{
	var query;
		query = await searchController.updateQueryBuilder(req)
	//console.log(query.updateQuery);
	Job.findById(req.params.id).then((job)=>{
	if(req.body.status=="Active") res.status(400).json({err:"Invalid status"});
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
		 }).catch((error)=>{res.status(400).json({err:"Job not updated"})})
		}).catch((error)=>{res.status(400).json({updated:"false"})});
	}).catch((err)=>{res.status(400).json({err:"Couldn't find employer"})});
});
//Update a freelance job
router.put("/freelance/:id",middleware.checkFreelanceJobOwnership,async (req,res) =>{
	var query;
		query = await searchController.updateQueryBuilder(req)
	//console.log(query.updateQuery);
	Freelance.findById(req.params.id).then((job)=>{
	if(req.body.status=="Active") res.status(400).json({err:"Invalid status"});
	if(req.body.startDate) query.update["startDate"]=req.body.startDate;
	if(req.body.endDate) query.update["endDate"]=req.body.endDate;
	const expiry=new Date(req.body.endDate);
		var days=(expiry-job.createdAt)/(1000*60*60*24) ;
		if(days<0 || days>90 )
		res.status(400).json({err:"Invalid time format"});
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
router.put("/savedJob/:id",middleware.isEmployer,async (req,res) =>{
	var query;
		query = await searchController.updateQueryBuilder(req)
	//console.log(query.updateQuery);
	Employer.findById(req.user._id).then((employer)=>{
	if(!employer.savedJobs.includes(req.params.id))
	res.status(400).json({err:"Invalid Job"});
	savedJob.findById(req.params.id).then((job)=>{
	if(req.body.status=="Active") res.status(400).json({err:"Invalid status"});
	if(req.body.expireAt){
	const expiry=new Date(req.body.expireAt);
		var days=(expiry-Date.now())/(1000*60*60*24) ;
		//console.log(days);
		if(days<0 || days>90 )
		res.status(400).json({err:"Invalid time format"});
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
router.put("/savedFreelance/:id",middleware.isEmployer,async (req,res) =>{
	var query;
		query = await searchController.updateQueryBuilder(req)
	//console.log(query.updateQuery);
	Employer.findById(req.user._id).then((employer)=>{
	if(!employer.savedFreelance.includes(req.params.id))
	res.status(400).json({err:"Invalid Job"});
	savedFreelance.findById(req.params.id).then((job)=>{
	if(req.body.status=="Active") res.status(400).json({err:"Invalid status"});
	if(req.body.endDate){
	const expiry=new Date(req.body.endDate);
		var days=(expiry-Date.now())/(1000*60*60*24) ;
		//console.log(days);
		if(days<0 || days>90 )
		res.status(400).json({err:"Invalid time format"});
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

//job search route ( not for freelance search)
router.post("/search", async (req, res) => {
    // query builder function
    const query = await searchController
        .queryBuilder(req)
        .then((query) => {
            var jobCount;
            var sponsoredJobs;
            if (query.skip == 0)
                Job.aggregate(
                    [
                        query.search,
                        {
                            $group: {
                                _id: null,
                                jobCount: {
                                    $sum: 1,
                                },
                            },
                        },
                    ],
                    (err, jobNum) => {
                        if (err) jobCount = 0;
                        else jobCount = jobNum[0];
                    },
                );

            Job.aggregate(
                [
                    query.sponsored,
                    {
                        $skip: query.sponsoredskip,
                    },
                    query.sort,
                    {
                        $limit: query.sponsoredlimiter,
                    },
                ],
                (err, sponsored) => {
                    if (err) sponsorFlag = 0;
                    //console.log(err);
                    else sponsoredJobs = sponsored;
                },
            );
            console.log(sponsoredJobs);
            //const userid = '5f1d72e270ff602dc0250747';
            // console.log(userid);
            Job.aggregate(
                [
                    query.search,
                    {
                        $skip: query.skip,
                    },
                    query.sort,
                    {
                        $limit: query.limiter,
                    },
                    //{$sort: { score: { $meta: "textScore" }} },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            specialization: 1,
                            // applied: {
                            //     $cond: {
                            //         if: { $eq:['$applicants.id',userid]},
                            //         then: 1,
                            //         else: 0,
                            //     },
                            // },
                            description: 1,
                            applicants: 1,
                            score: { $meta: "searchScore" },
                        },
                    },
                ],
                (err, jobs) => {
                    if (err)
                        res.status(400).json({
                            err: err,
                        });
                    else {
                        //Array.prototype.splice.apply(jobs, [query.limit/2,0].concat(sponsoredJobs));
                        if (sponsoredJobs && sponsoredJobs.length > 0)
                            jobs.splice(
                                Math.floor(jobs.length / 2),
                                0,
                                ...sponsoredJobs,
                            );
                        res.json({ jobs: jobs, count: jobCount });
                    }
                },
            );
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
});

//Similar jobs
router.post("/similar", (req, res) => {
    function addQuery(query, path) {
        let abc = {
            text: {
                query: `${query}`,
                path: `${path}`,
            },
        };
        return abc;
    }
    // settting limit sends back 3 similar jobs
    var limiter = 3;
    // building must query and should query

    var mustquery = [],
        shouldquery = [];
    if (req.body.location)
        mustquery.push(addQuery(req.body.location, "description.location"));
    if (req.body.pin) shouldquery.push(addQuery(req.body.pin, "address.pin"));
    if (req.body.profession)
        mustquery.push(addQuery(req.body.profession, "profession"));
    if (req.body.specialization)
        mustquery.push(addQuery(req.body.specialization, "specialization"));
    if (req.body.superSpecialization)
        shouldquery.push(
            addQuery(req.body.superSpecialization, "superSpecialization"),
        );

    Job.aggregate(
        [
            {
                $search: {
                    compound: {
                        must: mustquery,
                        should: shouldquery,
                    },
                },
            },
            {
                $limit: limiter,
            },
            {
                $sort: {
                    score: {
                        $meta: "textScore",
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    specialization: 1,
                    // 	applied: {
                    // 		$cond: {
                    // 			if: { $in: ["$applicants.id", userid] },
                    // 				then: 1,
                    // 			else: 0,
                    // 		},
                    // },
                    description: 1,
                    applicants: 1,
                    score: { $meta: "searchScore" },
                },
            },
        ],
        (err, jobs) => {
            if (err)
                res.status(400).json({
                    err: err,
                });
            else res.json({ jobs: jobs });
        },
    );
});

//Freelance Search
router.post("/freelanceSearch", async (req, res) => {
    const query = await searchController
        .queryBuilder(req)
        .then((query) => {
            var jobCount = 0;
            var sponsoredJobs = [];
            var dateQuery = [];
            // trivial condition in case no date arguments are recieved
            var trivialQuery = {
                title: { $ne: "" },
            };
            dateQuery.push(trivialQuery);
            var startDateMatch = {},
                endDateMatch = {};
            if (req.body.day) {
                dayMatch = { dayOfWeek: req.body.day };
                dateQuery.push(dayMatch);
            }

            if (req.body.startDate) {
                const mystartDate = new Date(req.body.startDate);
                startDateMatch = {
                    startDate: { $gte: mystartDate },
                };
                dateQuery.push(startDateMatch);
            }
            if (req.body.endDate) {
                const myendDate = new Date(req.body.endDate);
                endDateMatch = {
                    endDate: { $lte: myendDate },
                };
                dateQuery.push(endDateMatch);
            }
            if (req.body.startHour) {
                startHourMatch = {
                    startHour: { $gte: req.body.startHour },
                };
                dateQuery.push(startHourMatch);
            }
            if (req.body.endHour) {
                endHourMatch = {
                    endHour: { $lte: req.body.endHour },
                };
                dateQuery.push(endHourMatch);
            }
            //Built date query
            var query2 = {
                $match: {
                    $and: dateQuery,
                },
            };
            //job count pipeline
            Freelance.aggregate(
                [
                    query.search,
                    {
                        $project: {
                            startDate: 1,
                            endDate: 1,
                            title: 1,
                            profession: 1,
                            startHour: { $hour: "$startDate" },
                            endHour: { $hour: "$endDate" },
                            dayOfWeek: { $dayOfWeek: "$startDate" },
                        },
                    },
                    query2,
                    {
                        $group: {
                            _id: null,
                            jobCount: {
                                $sum: 1,
                            },
                        },
                    },
                ],
                (err, jobNum) => {
                    if (err) jobCount = 0;
                    else jobCount = jobNum[0];
                },
            );
            Freelance.aggregate(
                [
                    query.sponsored,
                    {
                        $project: {
                            _id: 1,
                            superSpecialization: 1,
                            tag: 1,
                            title: 1,
                            startDate: 1,
                            endDate: 1,
                            title: 1,
                            profession: 1,
                            startHour: { $hour: "$startDate" },
                            endHour: { $hour: "$endDate" },
                            dayOfWeek: { $dayOfWeek: "$startDate" },
                        },
                    },
                    {
                        $skip: query.sponsoredskip,
                    },
                    query.sort,
                    {
                        $limit: query.sponsoredlimiter,
                    },
                ],
                (err, sponsored) => {
                    if (err) console.log(err);
                    else sponsoredJobs = sponsored;
                },
            );
            Freelance.aggregate(
                [
                    query.search,
                    {
                        $project: {
                            _id: 1,
                            superSpecialization: 1,
                            tag: 1,
                            title: 1,
                            startDate: 1,
                            endDate: 1,
                            title: 1,
                            profession: 1,
                            startHour: { $hour: "$startDate" },
                            endHour: { $hour: "$endDate" },
                            dayOfWeek: { $dayOfWeek: "$startDate" },
                        },
                    },
                    query2,
                    {
                        $skip: query.skip,
                    },
                    query.sort,
                    {
                        $limit: query.limiter,
                    },
                ],
                (err, jobs) => {
                    if (err)
                        res.status(400).json({
                            err: err,
                        });
                    else {
                        if (sponsoredJobs.length != 0) {
                            jobs.splice(
                                Math.floor(jobs.length / 2),
                                0,
                                ...sponsoredJobs,
                            );
                        }
                        console.log(jobs);
                        res.json({ jobs: jobs, count: jobCount });
                    }
                },
            );
            //	}).catch((err) => res.status(400).json({err:err}));
        })

        .catch(function (error) {
            // handle error
            console.log(error);
        });
});

//===========================================================================

//router.put("/:id",middleware.isLoggedIn())
router.post("/apply/:id", middleware.isUser, (req, res) => {
    Job.findById(req.params.id).then((job) => {
        job.applicants = [
            ...job.applicants,
            {
                id: req.user._id,
                username: req.user.username,
            },
        ];
        job.save()
            .then((updatedJob) => {
                // res.json(updatedJob);
                User.findById(req.user._id)
                    .then((user) => {
                        user.applied.push({
                            id: updatedJob._id,
                            title: updatedJob.title,
                        });
                        user.save()
                            .then((updatedUser) => {
                                res.json({
                                    user: updatedUser,
                                    job: job,
                                });
                            })
                            .catch((err) =>
                                res.status(400).json({
                                    err: err,
                                }),
                            );
                    })
                    .catch((err) =>
                        res.status(400).json({
                            err: err,
                        }),
                    );
            })
            .catch((err) =>
                res.status(400).json({
                    err: err,
                }),
            );
    });
    req.user;
});

//router.put("/:id",middleware.isLoggedIn())
router.post("/apply/freelance/:id", middleware.isUser, (req, res) => {
	Freelance.findById(req.params.id).then((job) => {
		job.applicants = [
		...job.applicants,
		{
			id: req.user._id,
			username: req.user.username,
		},
		];
		job.save()
		.then((updatedJob) => {
                // res.json(updatedJob);
                User.findById(req.user._id)
                .then((user) => {
                	user.applied.push({
                		id: updatedJob._id,
                		title: updatedJob.title,
                	});
                	user.save()
                	.then((updatedUser) => {
                		res.json({
                			user: updatedUser,
                			job: job,
                		});
                	})
                	.catch((err) =>
                	       res.status(400).json({
                	       	err: err,
                	       }),
                	       );
                })
                .catch((err) =>
                       res.status(400).json({
                       	err: err,
                       }),
                       );
            })
		.catch((err) =>
		       res.status(400).json({
		       	err: err,
		       }),
		       );
	});
	req.user;
});
//accept applicant freelance
//STILL TODO 
router.put("/apply/freelance/:id"),middleware.checkFreelanceJobOwnership, (req,res)=>{
		User.findById(req.body.id).then((user) =>{
			//send mobile OTP
			Freelance.deleteOne({_id:req.params.id}).then()
		}).catch((err) => { res.status(400).json({err:"Wrong user"})});
}

//get multiple jobs
router.post("/all/jobs",middleware.isEmployer,(req,res)=>{
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
router.post("/all/freelance",middleware.isEmployer,(req,res)=>{
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
router.post("/all/savedJobs",middleware.isEmployer,(req,res)=>{
	Employer.findById(req.user._id).then((employer)=>{
		savedJob.find({_id:{$in:employer.savedJobs}}).then((jobs)=>{
			res.json({jobs:jobs});
		}).catch((err)=>{res.json({err:"Jobs not found"})});
	}).catch((err)=>{res.json({err:"Employer not found"})});
});

//  get multiple saved freelance jobs
router.post("/all/savedFreelance",middleware.isEmployer,(req,res)=>{
	Employer.findById(req.user._id).then((employer)=>{
		
		savedFreelance.find({_id:{$in:employer.savedFreelance}}).then((jobs)=>{
			res.json({jobs:jobs});
		}).catch((err)=>{res.json({err:"Jobs not found"})});
	}).catch((err)=>{res.json({err:"Employer not found"})});
});
//get saved job
router.get("/savedJob/:id",middleware.isEmployer,(req,res)=>{
	savedJob.findById(req.params.id)
	.then((job) =>{
		res.json(job);
	})
	.catch((err) =>res.status(400).json({err:"Job not found"}));
});
//get saved freelance job
router.get("/savedFreelance/:id",middleware.isEmployer,(req,res)=>{
	savedFreelance.findById(req.params.id)
	.then((job) =>{
		res.json(job);
	})
	.catch((err) =>res.status(400).json({err:"Job not found"}));
});
//get a job by id
router.get("/:id", (req, res) => {
    Job.findById(req.params.id)
        .then((job) => {
            res.json(job);
        })
        .catch((err) => res.status(400).json({ err: err }));
});
//get a freelance job by id
router.get("/freelance/:id", (req, res) => {
    Freelance.findById(req.params.id)
        .then((job) => {
            res.json(job);
        })
        .catch((err) => res.status(400).json({ err: err }));
});

//delete a job

router.delete("/:id", middleware.checkJobOwnership, (req, res) => {
	Job.findByIdAndDelete(req.params.id)
	.then(() => res.json("Job deleted successfully !"))
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       }),
	       );
});
//delete a job

router.delete("/savedJob/:id", middleware.isEmployer, (req, res) => {
	savedJob.findByIdAndDelete(req.params.id)
	.then(() => res.json("Saved Job deleted successfully !"))
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       }),
	       );
});
//delete a job

router.delete("/freelance/:id", middleware.checkFreelanceJobOwnership, (req, res) => {
	Freelance.findByIdAndDelete(req.params.id)
	.then(() => res.json("Freelance Job deleted successfully !"))
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       }),
	       );
});
//delete a job

router.delete("/savedFreelance/:id", middleware.isEmployer, (req, res) => {
	savedFreelance.findByIdAndDelete(req.params.id)
	.then(() => res.json("Saved Freelance Job deleted successfully !"))
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       }),
	       );
});

module.exports = router;
