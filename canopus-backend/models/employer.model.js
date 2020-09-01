const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    ObjectId=mongoose.Schema.ObjectId;
module.exports = mongoose.model(
    "Employer",
    new mongoose.Schema({
        username: String,
        resetPasswordToken:String,
        resetPasswordExpires:Date,
        emailVerifiedToken:String,
        emailVerified:Boolean,
        firstName: String,
        lastName: String,
        password: String,
        phone:String,
        role: String,
        type: String,
        address: Object,
        // {
        //     city: String,
        //     state: String,
        //     pin: Number,
                // lat:Number,
                // long:Number,
        // },
        //Employer Plan normal jobs
        sponsors:{
            allowed:Number,
            posted:Number,
        },
        locumtier:{
            allowed:Number,
            posted:Number,
            saved:Number,
            closed:Number,
        },
        jobtier: {
            allowed: Number,
            posted: Number,
            saved: Number,
            closed: Number,
        },
        freelancetier:{
            allowed:Number,
            posted:Number,
            saved:Number,
            closed:Number,
        },
        //profile page related,
        links: Array,// link to website or to other resources
        youtube: Array, // links to youtube video
        image: Array,//multiple hostpial images
        //description
        description: Object,
        //
        // {
        //     about: String //  about our company

       //         about2: String // why join our company // descri
        //     employeeCount: Number, // number of employees
        //     //show location on profile also from address object
        // }
        // profile
        //Empoyer valid status
        validated: Boolean,
        acceptedApplicants: [ 
            {
                id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                username:String,
            }
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
        jobs: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Job",
                },
                title: String,
                sid:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"savedJob"
                },
            },
        ],
        savedJobs: Array,
        savedFreelance: Array,
    }).plugin(passportLocalMongoose),
);
