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
        [   {
                $match:{
                    validated:"true"
                }
            },
            {
                $group: {
                    _id: null,
                    jobCount: {
                        $sum: 1,
                    },
                },
            },
        ]
    ).then((jobcount)=>{
        var userid; 
        try{
            userid=req.user.applied.map(item=>{
                return mongoose.Types.ObjectId(item.id);
            });
           // console.log(userid);
        }
        catch(err){
             userid=["null"];
        }
    Job.aggregate([
        {
            $match:{
                validated:"true"
            }
        },
        {
            $skip: skip,
        },
        {
            $limit: limiter,
        },
                    
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            sponsored:1,
                            validated:1,
                            specialization: 1,
                            superSpecialization:1,
                            address:1,
                            description:1,
                            author:1,
                            createdBy:1,
                            applied: {
                                $cond: {
                                    if: { $in:['$_id',userid]},
                                    then: 1,
                                    else: 0,
                                },
                            },
                            //'applied':{$eq:['$applicants.id',userid]},
                            score: { $meta: "searchScore" },
                        },
                    },
                   
                   
    ])
        .then((jobs) =>
            res.json({
                jobs: jobs,
                count: jobcount[0],
            }),
        )
        .catch((err) =>
            res.status(400).json({
                err: err,
            }),
        );
}).catch((err)=>res.status(400).json({err:"Error searching jobs"}));
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
                $match:{
                    validated:"true"
                }
            },
            {
                $group: {
                    _id: null,
                    jobCount: {
                        $sum: 1,
                    },
                },
            },
        ]
        ).then((jobcount)=>{
            var userid; 
                   try{
                       userid=req.user.appliedFreelance.map(item=>{
                           return mongoose.Types.ObjectId(item.id);
                       });
                      // console.log(userid);
                   }
                   catch(err){
                        userid=["null"];
                   }
    Freelance.aggregate([
        {
            $match:{
                validated:"true"
            }
        },
        {
            $skip: skip,
        },
        {
            $limit: limiter,
        },
        {
            $project:{
                _id: 1,
                            title: 1,
                            sponsored:1,
                            validated:1,
                            specialization: 1,
                            superSpecialization:1,
                            address:1,
                            description:1,
                            startDate: 1,
                            endDate: 1,
                            author:1,
                            category:1,
                            createdBy:1,  
                            applied: {
                                $cond: {
                                    if: { $in:['$_id',userid]},
                                    then: 1,
                                    else: 0,
                                },
                            },

                            score: { $meta: "searchScore" },
            }
        }
    ])
        .then((jobs) =>
            res.json({
                jobs: jobs,
                count: jobcount[0],
            }),
        )
        .catch((err) =>
            res.status(400).json({
                err: err,
            }),
        );
        }).catch((err)=>{res.status(400).json({err:"Error"})});
});
//===========================================================================

//job search route ( not for freelance search)
router.post("/search", async (req, res) => {
    // query builder function
    const query = await searchController
        .queryBuilder(req)
        .then((query) => {
           // if (query.skip == 0)
           //console.log(query.search);
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
                ).then((jobcount)=>{
                    var userid; 
                    try{
                        userid=req.user.applied.map(item=>{
                            return mongoose.Types.ObjectId(item.id);
                        });
                       // console.log(userid);
                    }
                    catch(err){
                         userid=["null"];
                    }
            Job.aggregate(
                [
                    query.search,
                    query.sort,
                    {
                        $skip: query.skip,
                    }, 
                    {
                        $limit: query.limiter,
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            sponsored:1,
                            validated:1,
                            profession:1,
                            specialization: 1,
                            superSpecialization:1,
                            address:1,
                            description:1,
                            author:1,
                            createdBy:1,
                            applied: {
                                $cond: {
                                    if: { $in:['$_id',userid]},
                                    then: 1,
                                    else: 0,
                                },
                            },
                            //'applied':{$eq:['$applicants.id',userid]},
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
                        res.json({ jobs: jobs, count: jobcount[0]});
                    }
                },
            );
                }).catch((err)=>{res.status(400).json({err:"Error"})});
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
                    applicants:1,
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
                ]).then((jobcount)=>{
                    var userid; 
                   try{
                       userid=req.user.appliedFreelance.map(item=>{
                           return mongoose.Types.ObjectId(item.id);
                       });
                       //console.log(userid);
                   }
                   catch(err){
                        userid=["null"];
                   }
            Freelance.aggregate(
                [
                    query.search,
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            sponsored:1,
                            validated:1,
                            profession: 1,
                            specialization: 1,
                            superSpecialization:1,
                            address:1,
                            description:1,
                            startDate: 1,
                            endDate: 1,
                            startHour: { $hour: "$startDate" },
                            endHour: { $hour: "$endDate" },
                            dayOfWeek: { $dayOfWeek: "$startDate" },author:1,
                            category:1,
                            createdBy:1,  
                            score: { $meta: "searchScore" },
                        },
                    },
                    query2,query.sort,
                    {
                        $skip: query.skip,
                    },
                    
                    {
                        $limit: query.limiter,
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            sponsored:1,
                            validated:1,
                            specialization: 1,
                            superSpecialization:1,
                            address:1,
                            description:1,
                            startDate: 1,
                            endDate: 1,
                            startHour:1,
                            endHour:1,
                            dayOfWeek:1,
                            author:1,
                            category:1,
                            createdBy:1,  
                            applied: {
                                $cond: {
                                    if: { $in:['$_id',userid]},
                                    then: 1,
                                    else: 0,
                                },
                            },
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
                        //console.log(jobs);
                        res.json({ jobs: jobs, count: jobcount[0] });
                    }
                },
            );
            	}).catch((err) => res.status(400).json({err:"error"}));
        })

        .catch(function (error) {
            // handle error
            console.log(error);
        });
});

//===========================================================================

//router.put("/:id",middleware.isLoggedIn())
router.post("/apply/job/:id", middleware.isUser, (req, res) => {
    User.findById(req.user._id).then((user)=>{
        Job.findById(req.params.id).then((job) => {
            //job validation
            // if(job.profession=='Surgeon' || job.profession=='Physician')
            //     if(job.specialization!=user.specialization)
            //     return res.status(400).json(({err:"Specialization doesn't match, update your profile!"}));
            if(job.validated==false)
            return res.status(400).json({err:"Job not active"});
            const applicants=job.applicants.map(item=>{
                return mongoose.Types.ObjectId(item.id);
            })
            if(applicants.includes(req.user._id))
            return res.status(400).json({err:"Already applied to this job"});
            job.applicants = [
            ...job.applicants,
            {
                id: req.user._id,
                name:`${user.salutation} ${user.firstName} ${user.lastName}`,
                image:user.image,
                username:user.username,
                phone:user.phone
            },
            ];
        job.save()
            .then((updatedJob) => {
                savedJob.findOne({jobRef:req.params.id}).then((sjob)=>{
                    sjob.applicants = [
                        ...sjob.applicants, {
                            id: req.user._id,
                            name:`${user.salutation} ${user.firstName} ${user.lastName}`,
                            image:user.image,
                            username:user.username,
                            phone:user.phone
                        },
                    ];
                    sjob.save().then((sjob)=>{
                // res.json(updatedJob);
                User.findById(req.user._id)
                    .then((user) => {
                        user.applied.push({
                            id: updatedJob._id,
                            title: updatedJob.title,
                        });
                        user.save()
                            .then((updatedUser) => {
                                req.login(updatedUser,(err)=>{
                                    if(err) return res.status(500).send(err);
                                    return res.json({status:"Applied"});
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
                    }).catch((err)=>{res.status(400).json({err:"Error saving job"})});
                }).catch((err)=>{res.status(400).json({err:"Error finding saved job"})});
            })
            .catch((err) =>
                res.status(400).json({
                    err: err,
                }),);
    });
    req.user;
}).catch((err)=>{res.status(400).json({err:"Invalid user"})});
});

//router.put("/:id",middleware.isLoggedIn())
router.post("/apply/freelance/:id", middleware.isUser, (req, res) => {
    User.findById(req.user._id).then((user)=>{
    Freelance.findById(req.params.id).then((job) => {

        // //job validation
        // if(job.profession=='Surgeon' || job.profession=='Physician')
        //         if(job.specialization!=user.specialization)
        //         return res.status(400).json(({err:"Specialization doesn't match, update your profile!"}));
        if(job.validated==false)
        return res.status(400).json({err:"Job not active"});
		const applicants=job.applicants.map(item=>{
			return mongoose.Types.ObjectId(item.id);
		})
		if(applicants.includes(req.user._id))
		return res.status(400).json({err:"Already applied to this job"});
		job.applicants = [
		...job.applicants,
		{
			id: user._id,
			name:`${user.salutation} ${user.firstName} ${user.lastName}`,
			image:user.image,
			username:user.username,
			phone:user.phone
		},
		];
		job.save()
		.then((updatedJob) => {
            savedFreelance.findOne({jobRef:req.params.id}).then((freelance)=>{
                freelance.applicants = [
                    ...freelance.applicants,
                    {
                        id: req.user._id,
                        name:`${user.salutation} ${user.firstName} ${user.lastName}`,
                        image:user.image,
                        username:user.username,
                        phone:user.phone
                    },
                    ];
                    freelance.save()
                    .then((savedFreelance) => {
                // res.json(updatedJob);
                User.findById(req.user._id)
                .then((user) => {
                	user.appliedFreelance.push({
                		id: updatedJob._id,
                		title: updatedJob.title,
                	});
                	user.save()
                	.then((updatedUser) => {
                        req.login(updatedUser,(err)=>{
                            if(err) return res.status(500).send(err);
                            return res.json({status:"Applied"});
                        })
                		
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
                    }).catch((err)=>{res.status(400).json({err:"Error saving job"})});
                }).catch((err)=>{res.status(400).json({err:"Error finding saved job"})});
            })
		.catch((err) =>
		       res.status(400).json({
		       	err: err,
		       }),
		       );
	});
    req.user;
}).catch((err)=>{res.status(400).json({err:"Invalid user"})});
});
// get job
router.get("/:id", (req, res) => {
	Job.findById(req.params.id)
	.then((job) => res.json({job:job}))
	.catch((err) =>
		   res.status(400).json({
			   err: err,
		   }),
		   );
	});
// get freelance
router.get("/freelance/:id", (req, res) => {
	Freelance.findById(req.params.id)
	.then((job) => res.json({job:job}))
	.catch((err) =>
		   res.status(400).json({
			   err: err,
		   }),
		   );
	});
module.exports = router;
