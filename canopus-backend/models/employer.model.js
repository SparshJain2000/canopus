const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
module.exports = mongoose.model(
    "Employer",
    new mongoose.Schema({
        username: String,
        password: String,

        role: String,
        type: String,
        description: String,
        address: {
            line: String,
            city: String,
            state: String,
            pin: Number,
        },
        //Employer Plan
        tier: {
            allowed: Number,
            posted: Number,
            closed: Number,
        },
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
