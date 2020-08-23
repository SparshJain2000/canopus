const { search } = require("./admin.router");
const { searchController } = require("../controllers/search.controller");
const { query: q } = require("express");

const router = require("express").Router(),
middleware = require("../middleware/index"),
Employer = require("../models/employer.model"),
User = require("../models/user.model"),
Job = require("../models/job.model"),
Freelance = require("../models/freelance.model"),
axios = require("axios");
//===========================================================================
//get all jobs
router.get("/", (req, res) => {
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
		$limit: limiter,
	},
	{
		$skip: skip,
	},])
	.then((jobs) =>
	      res.json({
			  jobs: jobs,
			  count:jobCount,
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
router.get("/freelance", (req, res) => {
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
		$limit: limiter,
	},
	{
		$skip: skip,
	},])
	.then((jobs) =>
	      res.json({
			  jobs: jobs,
			  count:jobCount,
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
		//TODO validation
		// if(employer.validated==true)
		// console.log(employer.validated);
		// if(employer.tier.allowed - employer.tier.posted<= 0)
		// res.status(400).json({
		// 	error:"Maximum Jobs Posted"
		// });
		// else
		// Employer.findByIdAndUpdate(req.user._id,{$inc:{"tier.posted":1}})
	let job = new Job({
		title: req.body.title,
		profession: req.body.profession,
		specialization: req.body.specialization,
		description: req.body.description,
		address: req.body.address,
		createdAt:new Date()
	});
	Job.create(job)
	.then((job) => {
		job.author.username = req.user.username;
		job.author.id = req.user._id;
		console.log(job);
		job.save()
		.then((job) => {
			Employer.findById(req.user._id).then((employer) => {
				employer.jobs = [
				...employer.jobs,
				{
					title: job.title,
					id: job._id,
				},
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
			});
		})
		.catch((err) =>
		       res.status(400).json({
		       	err: err,
		       	user: req.user,
		       }),
		       );
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
});
// Post freelance job
router.post("/freelancePost", middleware.isEmployer, (req, res) => {
	Employer.findById(req.user._id).then((employer) => {
		//TODO validation
		// if(employer.validated==true)
		// console.log(employer.validated);
		// if(employer.tier.allowed - employer.tier.posted<= 0)
		// res.status(400).json({
		// 	error:"Maximum Jobs Posted"
		// });
		// else
		// Employer.findByIdAndUpdate(req.user._id,{$inc:{"tier.posted":1}})
	let freelance = new Freelance({
		title: req.body.title,
		profession: req.body.profession,
		specialization: req.body.specialization,
		description: req.body.description,
		address: req.body.address,
		startDate:req.body.startDate,
		endDate:req.body.endDate
	});
	Freelance.create(freelance)
	.then((job) => {
		job.author.username = req.user.username;
		job.author.id = req.user._id;
		console.log(job);
		job.save()
		.then((job) => {
			Employer.findById(req.user._id).then((employer) => {
				employer.freelanceJobs = [
				...employer.freelanceJobs,
				{
					title: job.title,
					id: job._id,
				},
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
			});
		})
		.catch((err) =>
		       res.status(400).json({
		       	err: err,
		       	user: req.user,
		       }),
		       );
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
});
//===========================================================================

router.post("/search", async (req, res) => {
    // query builder function
    const query = await searchController.queryBuilder(req).then((query) => {
                var jobCount;
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
                //const userid = '5f1d72e270ff602dc0250747';
                // console.log(userid);
                Job.aggregate(
                    [
                        query.search,
                        {
                            $limit: query.limiter,
                        },
                        {
                            $skip: query.skip,
                        },
                        query.sort,
                        //{$sort: { score: { $meta: "textScore" }} },
                        {
                            $project: {
                                _id: 1,
								title: 1,
								specialization:1,
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
                    		res.json({ jobs: jobs, count: jobCount });
                    	}
                    })
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
						  specialization:1,
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
router.post("/freelance", async (req, res) => {
	const query = await searchController.queryBuilder(req).then((query) => {
		 var jobCount=0;
		 var dateQuery=[];
		 // trivial condition in case no date arguments are recieved
		 var trivialQuery={
			 title:{$ne:""}
		 }
		 dateQuery.push(trivialQuery);
		var startDateMatch={},endDateMatch={};
		 if(req.body.day){
		 dayMatch={dayOfWeek:req.body.day}
		 dateQuery.push(dayMatch);
		 }

		if(req.body.startDate){
			const mystartDate = new Date(req.body.startDate);
			startDateMatch={
					startDate:{$gte:mystartDate}
			}
			dateQuery.push(startDateMatch);
		}
		if(req.body.endDate){
			const myendDate = new Date(req.body.endDate);
			endDateMatch={
					endDate:{$lte:myendDate}
				}
			dateQuery.push(endDateMatch);
		}
		if(req.body.startHour){
			startHourMatch={
				startHour:{$gte:req.body.startHour}
			}
			dateQuery.push(startHourMatch);
		}
		if(req.body.endHour){
			endHourMatch={
				endHour:{$lte:req.body.endHour}
			}
			dateQuery.push(endHourMatch);
		}
		//Built date query
		var query2={
			$match:{
				$and:dateQuery
			}
		};
	
		//job count pipeline
		Freelance.aggregate(
			[
				query.search,
				{
					$project:
							{
							startDate:1,
							endDate:1,
							title:1,
							startHour: { $hour: "$startDate" },
							endHour:{$hour:"$endDate"},
							dayOfWeek: { $dayOfWeek: "$startDate" }
							}		

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
		//const userid = '5f1d72e270ff602dc0250747';
		// console.log(userid);
		// Aggregation pipeline
		Freelance.aggregate(
			[
				
				query.search,
				{
					$project:
							{
							_id:1,
							startDate:1,
							endDate:1,
							title:1,
							startHour: { $hour: "$startDate" },
							endHour:{$hour:"$endDate"},
							dayOfWeek: { $dayOfWeek: "$startDate" }
							}		

				},
				query2,
				{
					$limit: query.limiter,
				},
				{
					$skip: query.skip,
				},
				query.sort,
				
			],
			(err, jobs) => {
				if (err)
					res.status(400).json({
						err: err,
					});
				else {
					res.json({ jobs: jobs, count: jobCount });
				}
			})
		})
		.catch(function (error) {
		// handle error
		console.log(error);
	});
});

//===========================================================================
//get a job by id
router.get("/:id", middleware.isLoggedIn, (req, res) => {
	Job.findById(req.params.id)
	.then((job) => {
		res.json(job);
	})
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       }),
	       );
});

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

//===========================================================================
//update a job
// router.put("/:id", middleware.checkBlogOwnership, (req, res) => {
//     Job.findById(req.params.id)
//         .then((job) => {
//             job.title = req.body.title;
//             job.image = req.body.image;
//             job.body = req.body.body;
//             job.date = new Date();
//             job.likes = job.likes ? job.likes : [];
//             job.save()
//                 .then((updatedBlog) => res.json(updatedBlog))
//                 .catch((err) => res.status(400).json({ err: err }));
//         })
//         .catch((err) => res.status(400).json({ err: err }));
// });
//===========================================================================
//like a job
// router.put("/:id/like", middleware.isLoggedIn, (req, res) => {
// Job.findById(req.params.id).then((job) => {
//     job.likes = [
//         ...job.likes,
//         { username: req.user.username, id: req.user._id },
//     ];
//     job.save()
//         .then((updatedBlog) => res.json(updatedBlog))
//         .catch((err) => res.status(400).json({ err: err }));
// });
// });
//===========================================================================
//unlike a job
// router.put("/:id/unlike", middleware.isLoggedIn, (req, res) => {
//     Job.findById(req.params.id).then((job) => {
//         job.likes = job.likes.filter(
//             (user) => user.username != req.user.username,
//         );
//         job.save()
//             .then((updatedBlog) => res.json(updatedBlog))
//             .catch((err) => res.status(400).json({ err: err }));
//     });
// });
//===========================================================================
//get a job by id
router.get("/:id", middleware.isLoggedIn, (req, res) => {
	Job.findById(req.params.id)
	.then((job) => {
		res.json(job);
	})
	.catch((err) => res.status(400).json({ err: err }));
});

//delete a job

router.delete("/:id", middleware.isEmployer, (req, res) => {
	Job.findByIdAndDelete(req.params.id)
	.then(() => res.json("Job deleted successfully !"))
	.catch((err) =>
	       res.status(400).json({
	       	err: err,
	       }),
	       );
});

module.exports = router;
