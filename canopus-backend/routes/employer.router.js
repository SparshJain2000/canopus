const router = require("express").Router(),
    passport = require("passport"),
    middleware = require("../middleware/index"),
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
        description: req.body.description,
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

//Get employer details

router.get("/profile", middleware.isEmployer, (req, res) => {
    Employer.findById(req.employer._id)
        .then((employer) => res.json(employer))
        .catch((err) => res.status(400).json({ err: err }));
});

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
