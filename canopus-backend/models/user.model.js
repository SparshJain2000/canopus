const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
module.exports = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        emailVerifyToken: String,
        emailVerified: Boolean,
        createdAt: Date,
        lastUpdated: Date,
        validated: Boolean,
        role: String,
        salutation: String,
        firstName: String,
        lastName: String,
        password: String,
        phone: String,
        profession: String,
        specialization: String,
        title: String,
        dob: String,
        superSpecialization: Array,
        availability:Object,
        experience: [
            {
                title: String,
                startDate: Date,
                endDate: Date,
                institute: String,
                line: String,
            },
        ],
        education: [
            {
                institute: String,
                degree: String,
                speciality: String,
                startYear: String,
                endYear: String,
            },
        ],
        address: {
            pin: Number,
            city: String,
            state: String,
        },
        image: String,
        description: String,
        resume: String,
        availability: Object, // for locum calendar
        google: Object,
        facebook: Object,
        sponsors: {
            allowed: Number,
            posted: Number,
            closed: Number,
        },
        jobtier: {
            allowed: Number,
            saved: Number,
            posted: Number,
            closed: Number,
        },
        freelancetier: {
            allowed: Number,
            saved: Number,
            posted: Number,
            closed: Number,
        },
        locumtier: {
            allowed: Number,
            saved: Number,
            posted: Number,
            closed: Number,
        },
        acceptedApplicants: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                name: String,
                image: String,
                username: String,
                phone: String,
            },
        ],
        jobs: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Jobs",
                },
                title: String,
                sid: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "savedJobs",
                },
            },
        ],
        freelanceJobs: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Freelance",
                },
                title: String,
                sid: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "savedFreelance",
                },
            },
        ],
        savedJobs: Array,
        savedFreelance: Array,
        applied: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Job",
                },
                title: String,
            },
        ],
        appliedFreelance: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Freelance",
                },
                title: String,
            },
        ],

        //Resume fs upload
    }).plugin(passportLocalMongoose),
);
