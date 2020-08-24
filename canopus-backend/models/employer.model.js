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
        //Employer Plan normal jobs
        jobtier: {
            allowed: Number,
            posted: Number,
            closed: Number,
        },
        freelancetier:{
            allowed:Number,
            posted:Number,
            closed:Number,
        },
        websitelink: String,
        youtube: Array, // links to youtube videos
        image: Array,
        //Empoyer valid status
        validated: Boolean,
        freelanceJobs: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Freelance",
                },
                title: String,
            },
        ],
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
