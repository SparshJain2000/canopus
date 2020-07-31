const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
module.exports = mongoose.model(
    "Tags",
    new mongoose.Schema({
        uber:String,
        specialization:String,
        description:String

    }).plugin(passportLocalMongoose),
);
