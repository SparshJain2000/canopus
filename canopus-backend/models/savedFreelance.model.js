const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
// var blogSchema =
ObjectId=mongoose.Schema.ObjectId;
module.exports = mongoose.model(
    "SavedFreelance",
    new mongoose.Schema({
        jobRef:ObjectId,
        status:String,
        title: String,
        profession: String,
        specialization: String,
        superSpecialization:Array,
        address: Object,
        createdAt:Date,
        expireAt:Date,
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
        validated: String,
        sponsored: Boolean,
        tag: Array,
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
