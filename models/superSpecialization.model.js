const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
module.exports = mongoose.model(
    "SuperSpecialization",
    new mongoose.Schema({
        specialization:String,
        superSpecialization:String

    }).plugin(passportLocalMongoose),
);
