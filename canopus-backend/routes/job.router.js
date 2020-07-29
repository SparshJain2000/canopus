const router = require("express").Router(),
    middleware = require("../middleware/index"),
    Employer = require("../models/employer.model"),
    Job = require("../models/job.model");
//===========================================================================
//get all jobs
router.get("/", middleware.isLoggedIn, (req, res) => {
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
        location: req.body.location,
        description: req.body.description,
        // date: new Date(),
        // likes: [],
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
//get a job by id
router.get("/:id", middleware.isLoggedIn, (req, res) => {
    Job.findById(req.params.id)
        .then((job) => {
            res.json(job);
        })
        .catch((err) => res.status(400).json({ err: err }));
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
        .then(() => res.json("Job deleted successfully !")).
        .catch((err) => res.status(400).json({ err: err }));
});

//===========================================================================

router.post("/search",(req,res) => {
    let location=req.body.location;
    Job.find(description.location:{meta:`${location}`})
    .then((job) => res.json(job))
    .catch((err) => res.status(400).json({ err: err });
});

module.exports = router;

/*{
   "title":"Nurse",
   "location":"Mumbai",
   "description":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit ipsam officiis nisi repellat, quibusdam cupiditate doloremque expedita aperiam magnam. Assumenda eos a possimus dicta quaerat aliquam tenetur nostrum voluptas id?"
}*/
