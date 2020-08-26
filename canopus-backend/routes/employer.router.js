const { checkJobOwnership } = require("../middleware");

const router = require("express").Router(),
    passport = require("passport"),
    middleware = require("../middleware/index"),
    Job = require("../models/job.model"),
    Freelance = require("../models/freelance.model"),
    Employer = require("../models/employer.model");

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
module.exports = router;
/*
    "username":"sparshjain",
    "password":"sparsh@123"

    "title": "Second Blog",
    "image": "",
    "body": "this is second blog"

*/
