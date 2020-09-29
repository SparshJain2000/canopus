const router = require("express").Router(),
  passport = require("passport"),
  middleware = require('../middleware/index');
const User= require('../models/user.model');
  //google analytics auth

  router.get("/analytics",middleware.isLoggedIn,async (req,res)=>{
    if(!req.session.analytics){
      console.log("not");
    req.session.analytics=true;
    let user= await User.findById(req.user._id);
    req.logIn(user,function(err){
      res.json(req.session);
    })
    }
    else{
    res.json(req.session);
    }
  });
//Google auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      console.log(info);
      if (err) {
        console.log(err);
        res.redirect(`http://curoid.co?err=${err.name}`);
      }
      if (!user) {
        res.redirect(`http://curoid.co?err=${err.name}`);
      }
      req.logIn(user, function (err) {
        if (err) {
          res.redirect(`http://curoid.co?err=${err.name}`);
        }
        res.redirect(`http://curoid.co/`);
      });
    })(req, res, next);
  }
  // function (req, res) {
  //     console.log(req.user);
  //     var token = req.user.token ? req.user.token : "";
  //     console.log("===========================");
  //     console.log(token);
  //     res.redirect("http://localhost:8080?token=" + token);
  // },
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    authType: "reauthenticate",
    scope: ["email"],
  })
);

router.get("/facebook/callback", (req, res, next) => {
  passport.authenticate("facebook", (err, user, info) => {
    console.log(info);
    if (err)
      // return res.status(400).json({ err: err });
      res.redirect(`http://localhost:3000?err=${err.name}`);

    if (!user) res.redirect(`http://localhost:3000?err=${err.name}`);

    req.logIn(user, function (err) {
      if (err) {
        res.redirect(`http://localhost:3000?err=${err.name}`);
      }
      res.redirect(`http://localhost:3000/`);
    });
  })(req, res, next);
});

module.exports = router;
