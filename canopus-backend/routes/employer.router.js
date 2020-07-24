const router = require("express").Router(),
    passport = require("passport"),
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
        role: "Employer",
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
module.exports = router;

/*
    "username":"sparshjain",
    "password":"sparsh@123"

    "title": "Second Blog",
    "image": "",
    "body": "this is second blog"

*/
