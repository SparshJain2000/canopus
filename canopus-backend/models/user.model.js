const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
module.exports = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        firstName: String,
        lastName: String,
        password: String,
        role: String,
        description: String,
        //Previous job experience
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
