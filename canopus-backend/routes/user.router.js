const router = require("express").Router(),
    passport = require("passport"),
    middleware = require("../middleware/index"),
    User = require("../models/user.model");
Tag = require("../models/tag.model");

//===========================================================================
//get all users
router.route("/").get((req, res) => {
    User.find()
        .then((users) => {
            res.json({
                users: users.map((user) => {
                    return { username: user };
                }),
            });
        })
        .catch((err) => res.status(400).json({ err: err }));
});
//===========================================================================
//Sign up route
router.post("/", (req, res) => {
    const user = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        description: req.body.description,
        // address: {
        //     pin: req.body.pin,
        //     city: req.body.city,
        //     state: req.body.state,
        // },
        experience: req.body.experience,
        role: "User",
    });
    User.register(user, req.body.password)
        .then((user) => {
            passport.authenticate("user")(req, res, () => {
                res.json({ user: user });
            });
        })
        .catch((err) => res.status(400).json({ err: err }));
});
//===========================================================================
//Login route
// router.post("/login", passport.authenticate("user"), (req, res) => {
//     res.json({ user: req.user, message: `${req.user.username} Logged in` });
// });

router.post("/login", function (req, res, next) {
    passport.authenticate("user", (err, user, info) => {
        console.log(info);
        if (err) {
            return res.status(400).json({ err: err });
        }
        if (!user) {
            return res.status(400).json({ err: info });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(400).json({ err: err });
            }
            return res.json({
                user: req.user,
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
//Get user profile details

router.get("/profile", middleware.isUser, (req, res) => {
    User.findById(req.user._id)
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json({ err: err }));
});
//===========================================================================
//get user profile by id
router.get("/profile/:id", (req, res) => {
    User.findById(req.params.id)
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json({ err: err }));
});

// User profile update

router.put("/profile/update/", middleware.isUser, (req, res) => {
    const user = new User(req.body);
    User.findByIdAndUpdate(
        // the id of the item to find
        req.user._id,
        user,
        { new: true },

        // the callback function
        (err, todo) => {
            // Handle any possible database errors
            if (err) return res.status(500).send(err);
            return res.send(todo);
        },
    );
});
// TODO admin model for now works in user
router.post("/tag", (req, res) => {
    const tag = new Tag({
        uber: req.body.uber,
        specialization: req.body.specialization,
        description: req.body.description,
    });
    tag.save(tag)
        .then((tag) => {
            res.json({ user: tag });
        })
        .catch((err) => res.status(400).json({ err: err }));
});

module.exports = router;
/*
    "username":"sparshjain",
    "password":"sparsh@123"

    "title": "Second Blog",
    "image": "",
    "body": "this is second blog"

*/
