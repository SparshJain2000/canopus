const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
// var blogSchema =

module.exports = mongoose.model(
    "Job",
    new mongoose.Schema({
        validated: String,
        sponsored: String,
        createdAt:Date,
        createdBy:String,
        expireAt:Date,
        extension:Number,
        category:String,
        title: String,
        profession: String,
        specialization: String,
        superSpecialization:String,
        tag: Array,// Covid ,urgent tgs
        address: Object,
        // {
        //     line: String, //specific addresss
        //     city: String,
        //     state: String,
        //     pin: Number,
        // },
        description: Object,
        // {
        //      company : String // company name
        //     about:String //About the job responsibilites roles
        //     skills:String //Who should apply para description
        //     count : Number, //Number of jobs
        //     experience: String,
        //     incentives: String,
        //     type: String, // govt ,corporate
        //     status: String, // internship full time
        //     location: String,
        //     salary: Number,
        // },

        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employer",
            },
            username: String,
            instituteName:String,
            photo:String,
            about:String,
        },
        applicants: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                name:String,
				image:String,
				phone:String,
                username:String,
            },
        ],
        acceptedApplicants: [ 
            {
                id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                name:String,
				image:String,
				phone:String,
                username:String,
            }
        ],
    }).plugin(passportLocalMongoose),
);
