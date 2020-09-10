const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
module.exports = mongoose.model(
    "Profession",
    new mongoose.Schema({
        name:String,


    }).plugin(passportLocalMongoose),
);
