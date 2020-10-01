const router = require("express").Router(),
  passport = require("passport"),
  middleware = require('../middleware/index');
const User= require('../models/user.model');
  //google analytics auth

router.get("/user/analytics",middleware.isUser,async (req,res)=>{
  if(!req.session.analytics){
  req.session.analytics=true;
  res.json({status:"ok"});
  }
  else{
  res.json({status:"already logged"});
  }
});
router.get("/employer/analytics",middleware.isEmployer,async (req,res)=>{
  if(!req.session.analytics){
  req.session.analytics=true;
  res.json({status:"ok"});
  }
  else{
  res.json({status:"already logged"});
  }
});
//Google auth
router.get(
  "/google/user",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
//Google auth
router.get(
  "/google/employer",
  passport.authenticate("google_employer", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/user/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      console.log(info);
      if (err) {
        console.log(err);
        res.redirect(`http://www.curoid.co?err=${err.name}`);
      }
      if (!user) {
        res.redirect(`http://www.curoid.co?err=${err.name}`);
      }
      req.logIn(user, function (err) {
        if (err) {
          res.redirect(`http://www.curoid.co?err=${err.name}`);
        }
        res.redirect(`http://www.curoid.co/`);
      });
    })(req, res, next);
  }
);
router.get(
  "/google/employer/callback",
  (req, res, next) => {
    passport.authenticate("google_employer", (err, user, info) => {
      console.log(info);
      if (err) {
        console.log(err);
        res.redirect(`http://www.curoid.co?err=${err.name}`);
      }
      if (!user) {
        res.redirect(`http://www.curoid.co?err=${err.name}`);
      }
      req.logIn(user, function (err) {
        if (err) {
          res.redirect(`http://www.curoid.co?err=${err.name}`);
        }
        res.redirect(`http://www.curoid.co/`);
      });
    })(req, res, next);
  }
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
