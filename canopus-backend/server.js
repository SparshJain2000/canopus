const express = require("express"),
    app = express(),
    cors = require("cors"),
    User = require("./models/user.model"),
    Employer = require("./models/employer.model"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStratergy = require("passport-local"),
    jobRouter = require("./routes/job.router"),
    path = require("path"),
    userRouter = require("./routes/user.router"),
    authRouter = require("./routes/auth.router"),
    employerRouter = require("./routes/employer.router"),
    GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
    bodyParser = require("body-parser");
require("dotenv").config();
//==========================================================================
app.use(bodyParser.json());
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
app.use(
    require("express-session")({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    }),
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
            callbackURL: "http://localhost:8080/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({ "google.id": profile.id }, function (err, user) {
                if (err) return done(err);
                if (user) return done(null, user);
                else {
                    var newUser = new User();
                    newUser.username = profile.emails[0].value;
                    newUser.role = "User";
                    newUser.image = profile.photos[0].value;
                    newUser.google = {
                        id: profile.id,
                        token: accessToken,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    };
                    newUser.firstName = profile.name.givenName;
                    newUser.lastName = profile.name.familyName;

                    newUser.save((err, user) => {
                        if (!err) return done(err, user);
                    });
                    // done(null, userData);
                }
            });
        },
        // User.authenticate(),
    ),
);
passport.serializeUser((user, done) => {
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
//===========================================================================
//render static files (deployment)
app.use(express.static("canopus-frontend/build"));

//===========================================================================
app.use("/api/job", jobRouter);
app.use("/api/user", userRouter);
app.use("/api/employer", employerRouter);
app.use("/auth", authRouter);
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
