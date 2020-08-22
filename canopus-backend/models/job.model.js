const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
// var blogSchema =
module.exports = mongoose.model(
    "Job",
    new mongoose.Schema({
        title: String,
        profession: String,
        specialization: String,
        superSpecialization:Array,
        address: Object,
        // {
        //     line: String, //specific addresss
        //     city: String,
        //     state: String,
        //     pin: Number,
        // },
        description: Object,
        // {
        //      compay : String // company name
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
        validated: Boolean,
        sponsored: Boolean,
        tag: Array,// Covid ,urgent tgs
        // date: Date,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employer",
            },
            username: String,
        },
        applicants: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                username: String,
            },
        ],
        // likes: [
        //     {
        //         id: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             ref: "User",
        //         },
        //         username: String,
        //     },
        // ],
    }).plugin(passportLocalMongoose),
);
