const express = require("express"),
    app = express(),
    cors = require("cors"),
    User = require("./models/user.model"),
    Employer = require("./models/employer.model"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStratergy = require("passport-local"),
    jobRouter = require("./routes/job.router"),
    searchRouter = require("./routes/search.router"),
    userRouter = require("./routes/user.router"),
    authRouter = require("./routes/auth.router"),
    uploadRouter = require("./routes/blob.router"),
    employerRouter = require("./routes/employer.router"),
    adminRouter = require("./routes/admin.router"),
    GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
    FacebookStrategy = require("passport-facebook").Strategy,
    bodyParser = require("body-parser"),
    path = require('path');
var session = require('express-session')
var MemoryStore = require('memorystore')(session)
 
require("dotenv").config();
const GOOGLE_ANALYTICS=process.env.GOOGLE_ANALYTICS;
var ua = require("universal-analytics");
var visitor = ua(GOOGLE_ANALYTICS);
//==========================================================================
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
    );
    next();
});
// app.use(ua.middleware(GOOGLE_ANALYTICS, {cookieName: '_ga'}));
app.use(session(
    {
        secret: process.env.SECRET,
        cookie: { maxAge: 100*60*15 },
        store: new MemoryStore({
          checkPeriod: 86400000 // prune expired entries every 24h
        }),
        rolling:true,
        resave: false,
        saveUninitialized: false,
    })
);
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(
    "employer",
    new LocalStratergy({ usernameField: "username" }, Employer.authenticate()),
);
passport.use(
    "user",
    new LocalStratergy({ usernameField: "username" }, User.authenticate()),
);
passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://www.curoid.co/auth/google/user/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({ "google.id": profile.id }, function (err, user) {
                if (err) return done(err);
                if (user) return done(null, user);
                else {
                    var user = new User();
                    user.username = profile.emails[0].value;
                    user.role = "User";
                    user.emailVerified = true;
                    user.image = profile.photos[0].value;
                    user.google = {
                        id: profile.id,
                        token: accessToken,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    };
                    user.salutation = "Dr";
                    user.firstName = profile.name.givenName;
                    user.lastName = profile.name.familyName;

                    user.save((err, user) => {
                        if (!err) return done(err, user);
                    });
                    // done(null, userData);
                }
            });
        },
        // User.authenticate(),
    ),
);
passport.use(
    "googleEmployer",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://www.curoid.co/auth/google/employer/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            Employer.findOne({ "google.id": profile.id }, function (err, user) {
                if (err) return done(err);
                if (user) return done(null, user);
                else {
                    var user = new Employer();
                    user.username = profile.emails[0].value;
                    user.role = "Employer";
                    user.emailVerified = true;
                    user.image = profile.photos[0].value;
                    user.google = {
                        id: profile.id,
                        token: accessToken,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    };
                    user.firstName = profile.name.givenName;
                    user.lastName = profile.name.familyName;

                    user.save((err, user) => {
                        if (!err) return done(err, user);
                    });
                    // done(null, userData);
                }
            });
        },
        // User.authenticate(),
    ),
);

passport.use(
    "facebook",
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://www.curoid.co/auth/facebook/callback",
            profileFields: [
                "id",
                "email",
                "displayName",
                "name",
                "picture.width(400).height(400)",
            ],
            enableProof: true,
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile);
            User.findOne({ "facebook.id": profile.id }, function (err, user) {
                if (err) return cb(err);
                if (user) return cb(null, user);
                else {
                    var user = new User();
                    user.username = profile.emails
                        ? profile.emails[0].value
                        : "";
                    user.role = "User";
                    user.image = profile.photos[0].value;
                    user.facebook = {
                        id: profile.id,
                        token: accessToken,
                    };
                    user.firstName = profile.name.givenName;
                    user.lastName = profile.name.familyName;
                    user.emailVerified = true;
                    user.save((err, user) => {
                        if (!err) return cb(err, user);
                    });
                }
            });
        },
    ),
);
passport.serializeUser((user, done) => {
    //experimental
    user.salt=undefined;
    user.hash=undefined;
    done(null, user);
});
passport.deserializeUser((user, done) => {
    if (user != null) {
        done(null, user);
    }
});

//===========================================================================
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
mongoose.connection.once("open", () => {
    console.log("connected to MONGO");
});
// might be problematic
mongoose.set('useFindAndModify', false);
//===========================================================================
//render static files (deployment)
app.use(express.static("canopus-frontend/build"));

//===========================================================================
app.use("/api/job", jobRouter);
app.use("/api/user", userRouter);
app.use("/api/employer", employerRouter);
app.use("/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/admin", adminRouter);
app.use("/api/search",searchRouter);
//===========================================================================
//render frontend file (deployment)
app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, "canopus-frontend/build/index.html"));
});
//===========================================================================

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`🌎 Listening to ${port}`);
});
