const router = require("express").Router(),
    middleware = require("../middleware/index"),
    Employer = require("../models/employer.model"),
    User = require("../models/user.model"),
    Job = require("../models/job.model"),
    FreelanceJob = require("../models/freelance.model");
//===========================================================================
//get all jobs
router.get("/", (req, res) => {
    Job.find()
        .then((jobs) => res.json({ jobs: jobs, user: req.user }))
        .catch((err) => res.status(400).json({ err: err }));
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
    let job = new Job({
        title: req.body.title,
        profession: req.body.profession,
        specialization: req.body.specialization,
        superSpecialization: req.body.superSpecialization,
        description: req.body.description,
        address: req.body.address,

        sponsored: true,
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
                            .catch((err) => res.status(400).json({ err: err }));
                    });
                })
                .catch((err) =>
                    res.status(400).json({ err: err, user: req.user }),
                );
        })
        .catch((err) => res.status(400).json({ err: err, user: req.user }));
});
//===========================================================================


router.post("/search", (req, res) => {
    console.log(req.body);
    function addQuery(query, path) {
        let abc = {
            text: {
                query: `${query}`,
                path: `${path}`,
            },

        };
        return abc;
    }

    // settting limit and skip
    var skip = parseInt(req.body.skip) || 0;
    var limiter = parseInt(req.body.limit) || 10;
    // building must query and should query

    var mustquery=[],shouldquery=[];
    if(req.body.location)
        mustquery.push(addQuery(req.body.location,"description.location"));
    if(req.body.pin)
        shouldquery.push(addQuery(req.body.pin,"address.pin"));
    if(req.body.profession)
        mustquery.push(addQuery(req.body.profession,"profession"));
    if(req.body.specialization)
        mustquery.push(addQuery(req.body.specialization,"specialization"));
    if(req.body.superSpecialization)
        mustquery.push(addQuery(req.body.superSpecialization,"superSpecialization"));
    if(req.body.incentives)
        shouldquery.push(addQuery(req.body.incentives,"description.incentives"));
    if(req.body.type)
        shouldquery.push(addQuery(req.body.type,"description.type"));
    if(req.body.status)
        mustquery.push(addQuery(req.body.status,"description.status"));
     
    search={$search: {
        "compound": {
            "must":mustquery,
            "should":shouldquery
        }}
    };
    // Ordering by Relevance and date filters
    if(req.body.order='Relevance')
        sort = {$sort: {score: { $meta: "textScore" }}};
    if(req.body.order='New')
        sort ={$sort:{ '_id':- 1}};
    if(req.body.order='Old')
        sort = { $sort: { '_id': 1}};
        console.log(Job.aggregate([search,{$group:{$sum:1}}]));
    Job.aggregate([
            search,
            { $limit: limiter},
            { $skip: skip},
            sort,
            {
                $project: {
                    _id: 0,
                    applicants: 0,
                    author: 0,
                    tag: 0
                },
            },
        ],
        (err, jobs) => {
            if (err) res.status(400).json({ err: err });
            else res.json(jobs);
        },
    );
    });

//Similar jobs
router.post("/similar",(req,res) => {
    function addQuery(query,path){
        let abc=
         {
             "text":
                 {
                     "query": `${query}`,
                     "path": `${path}`

                 }
         };
        return abc;
     }
     // settting limit sends back 3 similar jobs
     var limiter = 3;
     // building must query and should query
 
     var mustquery=[],shouldquery=[];
     if(req.body.location)
         mustquery.push(addQuery(req.body.location,"description.location"));
     if(req.body.pin)
         shouldquery.push(addQuery(req.body.pin,"address.pin"));
     if(req.body.profession)
         mustquery.push(addQuery(req.body.profession,"profession"));
     if(req.body.specialization)
         mustquery.push(addQuery(req.body.specialization,"specialization"));
     if(req.body.superSpecialization)
         mustquery.push(addQuery(req.body.superSpecialization,"superSpecialization"));


 
     Job.aggregate([
         {
             $search: {
                 "compound": {
                     "must":mustquery,
                     "should":shouldquery
                     },
                 },
             },
             { $limit: limiter},
             { $sort: { score: { $meta: "textScore" } } },
 
             {
                 $project: {
                     _id: 0,
                     applicants: 0,
                     author: 0,
                     tag: 0,
                     score: { $meta: "textScore" }
                 },
             },
         ],
         (err, jobs) => {
             if (err) res.status(400).json({ err: err });
             else res.json(jobs);
         },
     );
 });
 
//Freelance Search
router.post("/freelance",(req,res) =>{
    function addQuery(query,path){
        let abc=
         {
             "text":
                 {
                     "query": `${query}`,
                     "path": `${path}`
                 }
         };
        return abc;
     }
     // settting limit and skip
     var skip = parseInt(req.body.skip) || 0;
     var limiter = parseInt(req.body.limit) || 10;
     // building must query and should query
 
     var mustquery=[],shouldquery=[];
     if(req.body.location)
         mustquery.push(addQuery(req.body.location,"description.location"));
     if(req.body.pincode)
         shouldquery.push(addQuery(req.body.pincode,"description.pincode"));
     if(req.body.profession)
         mustquery.push(addQuery(req.body.profession,"profession"));
     if(req.body.specialization)
         mustquery.push(addQuery(req.body.specialization,"specialization"));
     if(req.body.superSpecialization)
         mustquery.push(addQuery(req.body.superSpecialization,"superSpecialization"));
     if(req.body.incentives)
         shouldquery.push(addQuery(req.body.incentives,"description.incentives"));
     if(req.body.type)
         mustquery.push(addQuery(req.body.type,"description.type"));
    
         // empty request response
     if(!(req.body))
     {
        search={};

     }

 
 
     FreelanceJob.aggregate([
             {
             $search: {
                 "compound": {
                     "must":mustquery,
                     "should":shouldquery
                     },
                 },
             },
             { $limit: limiter},
             { $skip: skip},
             { $sort: { score: { $meta: "textScore" } } },
 
             {
                 $project: {
                     _id: 0,
                     applicants: 0,
                     author: 0,
                     tag: 0
                 },
             },
         ],
         (err, jobs) => {
             if (err) res.status(400).json({ err: err });
             else res.json(jobs);
         },
     );
 });
 

//===========================================================================
//get a job by id
router.get("/:id", middleware.isLoggedIn, (req, res) => {
    Job.findById(req.params.id)
        .then((job) => {
            res.json(job);
        })
        .catch((err) => res.status(400).json({ err: err }));
});

//router.put("/:id",middleware.isLoggedIn())

router.post("/apply/:id", middleware.isUser, (req, res) => {
    Job.findById(req.params.id).then((job) => {
        job.applicants = [
            ...job.applicants,
            { id: req.user._id, username: req.user.username },
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
                                res.json({ user: updatedUser, job: job });
                            })
                            .catch((err) => res.status(400).json({ err: err }));
                    })
                    .catch((err) => res.status(400).json({ err: err }));
            })
            .catch((err) => res.status(400).json({ err: err }));
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
//delete a job

router.delete("/:id", middleware.isEmployer, (req, res) => {
    Job.findByIdAndDelete(req.params.id)
        .then(() => res.json("Job deleted successfully !"))
        .catch((err) => res.status(400).json({ err: err }));
});

module.exports = router;

/*{
   "title":"Nurse",
   "specialization":"Mumbai",
   "description":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit ipsam officiis nisi repellat, quibusdam cupiditate doloremque expedita aperiam magnam. Assumenda eos a possimus dicta quaerat aliquam tenetur nostrum voluptas id?"
}*/


