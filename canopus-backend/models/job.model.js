const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
// var blogSchema =
module.exports = mongoose.model(
    "Job",
    new mongoose.Schema({
        title: String,
        profession:Array,
        specialization:Array,
        sponsored: Boolean,
        description: {
            line:String,
            experience: String,
            incentives: String,
            type:String,
            status: String,
            location: String,
            salary: Number,

        },


        // date: Date,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employer",
            },
            username: String,
        },
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
