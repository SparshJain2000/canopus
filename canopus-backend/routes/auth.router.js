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

router.get('/auth/linkedin/user',
  passport.authenticate('linkedin_user'),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  });

  router.get(
    "/linkedin/user/callback",
    (req, res, next) => {
      passport.authenticate("linkedin_user", (err, user, info) => {
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
    "/linkedin/employer/callback",
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

module.exports = router;
