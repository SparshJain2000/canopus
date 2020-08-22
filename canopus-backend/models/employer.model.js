const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
module.exports = mongoose.model(
    "Employer",
    new mongoose.Schema({
        username: String,
        firstName: String,
        lastName: String,
        password: String,
        role: String,
        type: String,
        description: String,
        address: Object,
        // {
        //     line: String,
        //     city: String,
        //     state: String,
        //     pin: Number,
        // },
        //Employer Plan
        tier: {
            allowed: Number,
            posted: Number,
            closed: Number,
        },
        //Empoyer valid status
        validated: Boolean,
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
