const Job = require("../models/job.model"),
      Freelance = require("../models/freelance.model"),
      savedJob = require("../models/savedJobs.model"),
      savedFreelance = require("../models/savedFreelance.model"),
      Employer = require("../models/employer.model"),
      User = require("../models/user.model");
    middleware = {};
middleware.isLoggedIn = (req, res, next) => {
    req.isAuthenticated()
        ? next()
        : res.status(400).json({ err: "Not Logged in" });
};
middleware.checkJobOwnership = (req, res, next) => {
    req.isAuthenticated()
        ? //Is Authorized
          Job.findById(req.params.id)
              .then((foundJob) => {
                  foundJob.author.id.equals(req.user._id)
                      ? next()
                      : res.status(400).json({ err: "Not the Author" });
              })
              .catch((err) => res.status(400).json({ err: err }))
        : res.status(400).json({ err: "Not logged in" });
};
middleware.checkFreelanceJobOwnership = (req, res, next) => {
    req.isAuthenticated()
        ? //Is Authorized
          Freelance.findById(req.params.id)
              .then((foundJob) => {
                  foundJob.author.id.equals(req.user._id)
                      ? next()
                      : res.status(400).json({ err: "Not the Author" });
              })
              .catch((err) => res.status(400).json({ err: err }))
        : res.status(400).json({ err: "Not logged in" });
};

middleware.checkPostOwnership = (req, res, next) => {
    
Job.findById(req.params.id)
    .then((foundJob) => {
        if(foundJob.author.id.equals(req.user._id))
        next();
        else throw new Error("Duplicate ObjectId");
                
    })
    .catch((err) =>{
        Freelance.findById(req.params.id)
            .then((foundJob) => {
                foundJob.author.id.equals(req.user._id)
                    ? next()
                    : res.status(400).json({ err: "Not the Author" });
            });
        });
};

middleware.checkSavedOwnership = (req, res, next) => {
    savedJob.findById(req.params.id)
    .then((foundJob) => {
        if(foundJob.author.id.equals(req.user._id))
        next();
        else throw new Error("Duplicate ObjectId");
              
    })
    .catch((err) =>{
        savedFreelance.findById(req.params.id)
            .then((foundJob) => {
                foundJob.author.id.equals(req.user._id)
                    ? next()
                    : res.status(400).json({ err: "Not the Author" });
            });
     });
};

middleware.isEmployer = (req, res, next) => {
    req.isAuthenticated()
        ? req.user.role === "Employer"
            ? next()
            : res.status(400).json({ err: "Not Employer" })
        : res.status(400).json({ err: "Not Logged in" });
};
middleware.isUser = (req, res, next) => {
    req.isAuthenticated()
        ? req.user.role === "User"
            ? next()
            : res.status(400).json({ err: "Not User" })
        : res.status(400).json({ err: "Not Logged in" });
};
middleware.isAdmin = (req, res, next) => {
    req.isAuthenticated()
        ? req.user.role === "Admin"
            ? next()
            : res.status(400).json({ err: "Not Admin" })
        : res.status(400).json({ err: "Not Logged in" });
};
middleware.dateValidator = (req, res, next) => {
    //validating freelance end date
    if(req.body.category!="Job" && req.body.endDate){
        const expiry = new Date(req.body.endDate);
        var days = (expiry - Date.now()) / (1000 * 60 * 60 * 24);
        if (days < 0 || days > 30)
           res.status(400).json({err:"400"});
        else next();     
      }
    else next();
};
module.exports = middleware;
