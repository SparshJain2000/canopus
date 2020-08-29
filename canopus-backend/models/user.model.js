const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
module.exports = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        firstName: String,
        lastName: String,
        password: String,
        phone:String,
        role: String,
        image: String,
        description: String,
        resume: String,
        google: Object,
        facebook: Object,
        validated:Boolean,
        sponsors:Number,
        jobtier:{
            allowed:Number,
            saved:Number,
            posted:Number,
            closed:Number,
        },
        freelancetier:{
            allowed:Number,
            saved:Number,
            posted:Number,
            closed:Number,
        },
        locumtier:{
            allowed:Number,
            saved:Number,
            posted:Number,
            closed:Number,
        },
        locum: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Freelance",
                },
                title: String,
                sid:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"savedFreelance"
                },
            },
        ],
        jobs: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Jobs",
                },
                title: String,
                sid:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"savedJobs"
                },
            },
        ],
        freelanceJobs: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Freelance",
                },
                title: String,
                sid:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"savedFreelance"
                },
            },
        ],
        experience: [
            {
                title: String,
                time: String,
                line: String,
            },
        ],
        address: {
            pin: Number,
            city: String,
            state: String,
        },
        applied: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Job",
                },
                title: String,
            },
        ],
        //Resume fs upload
    }).plugin(passportLocalMongoose),
);
