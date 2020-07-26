const router = require("express").Router(),
    passport = require("passport"),
    middleware = require("../middleware/index"),
    User = require("../models/user.model");

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
    passport.authenticate("user", function (err, user, info) {
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

//Get user profile details

router.get("/profile" , middleware.isUser, (req,res) => {
   User.findById(req.user._id).then((user) => res.json(user))
                               .catch((err) => res.status(400).json({ err: err }));
});

// User profile update

router.put("/profile/update/" , middleware.isUser, (req,res) => {

    const user= new User({

      ...(req.body.description) && { description: req.body.description},
       //Previous job experience
      ...(req.body.experience) && {experience:[
            {
                title:req.body.experience.title,
                time:req.body.experience.time,
                line:req.body.experience.line
            }
        ]},
        ...(req.body.address) && {address:{
            pin:req.body.address.pin,
            city:req.body.address.city,
            state:req.body.address.state
        }}
    });
    User.findByIdAndUpdate(
        // the id of the item to find
        req.user._id,
        req.body,
        {new: true},

        // the callback function
        (err, todo) => {
            // Handle any possible database errors
            if (err) return res.status(500).send(err);
            return res.send(todo);
        }
    )
});



module.exports = router;
/*
    "username":"sparshjain",
    "password":"sparsh@123"

    "title": "Second Blog",
    "image": "",
    "body": "this is second blog"

*/
