const router = require("express").Router(),
    passport = require("passport");
//Google auth
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    }),
);
router.get(
    "/google/callback",

    passport.authenticate("google"),
    (req, res) => {
        // res.json({ user: req.user });

        res.redirect("http://localhost:3000/search-jobs");
    },

    // function (req, res) {
    //     console.log(req.user);
    //     var token = req.user.token ? req.user.token : "";
    //     console.log("===========================");
    //     console.log(token);
    //     res.redirect("http://localhost:8080?token=" + token);
    // },
);

router.get("/facebook", passport.authenticate("facebook"));

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        authType: "reauthenticate",
        scope: ["user_friends", "manage_pages", "email"],
    }),
    (req, res) => {
        console.log(req.user);
        res.redirect("http://localhost:3000/profile");
    },
);

module.exports = router;
