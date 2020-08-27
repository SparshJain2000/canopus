const Job = require("../models/job.model"),
      Freelance = require("../models/freelance.model");
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
// middleware.checkSavedJobOwnership = (req ,res, next) =>{
//     req.isAuthenticated()
//         ? // Is authorized

// }
middleware.isEmployer = (req, res, next) => {
    req.isAuthenticated()
        ? req.user.role === "Employer"
            ? next()
            : res.status(400).json({ err: "Not Employer" })
        : res.status(400).json({ err: "Not Logged in" });
};
middleware.isUser = (req, res, next) => {
    req.isAuthenticated()
        ? req.user.role === "User" || "Admin"
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
module.exports = middleware;
