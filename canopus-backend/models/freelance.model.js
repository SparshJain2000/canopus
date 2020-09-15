const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
// var blogSchema =
module.exports = mongoose.model(
    "Freelance",
    new mongoose.Schema({
        validated: String,
        sponsored: String,
        createdAt:Date,
        createdBy:String,
        expireAt:Date,
        category:String,
        extension:Number,
        title: String,
        profession: String,
        specialization: String,
        superSpecialization:Array,
        tag: Array,
        address: Object,
        // {
        //     line: String, //specific addresss
        //     city: String,
        //     state: String,
        //     pin: Number,
        // },
        startDate: Date,
        endDate: Date,
        // {
        //     day:String
        //     start:Number,
        //     end:Number
        // },
        description: Object,
        // {
        //     time:String,
        //     line: String,
        //     experience: String,
        //     incentives: String,
        //     type: String,
        //     status: String,
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
            name :String,
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
        attachedApplicants:[
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
        ]
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
