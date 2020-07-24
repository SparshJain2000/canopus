const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
module.exports = mongoose.model(
    "Employer",
    new mongoose.Schema({
        username: String,
        password: String,
        role: String,
        jobs: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Job",
                },
                title: String,
            },
        ],
    }).plugin(passportLocalMongoose),
);
