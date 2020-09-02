const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
module.exports = mongoose.model(
    "Specialization",
    new mongoose.Schema({
        profession:String,
        specialization:String

    }).plugin(passportLocalMongoose),
);
