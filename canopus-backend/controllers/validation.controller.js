const Employer = require("../models/employer.model"),
Profession = require("../models/profession.model"),
Specialization = require("../models/specialization.model"),
SuperSpecialization = require("../models/superSpecialization.model"),
Job = require("../models/job.model"),
Freelance = require("../models/freelance.model");


function jobRequestValidator(req){

    if (req.body.profession)
       {
            Profession.findOne({name:req.body.profession}).then((profession)=>{
                if (req.body.specialization)
                {
                    Specialization.findOne({profession:req.body.profession,specialization:req.body.specialization})
                    .then((specialization)=>{
                        if (req.body.specialization)
                        {
                            Specialization.findOne({specialization:req.body.specialization,superSpecialization:req.body.superSpecialization})
                           .then((specialization)=>{
                               return true;
                            }).catch((err)=>{return false});
                        }
                        else return false
                    }).catch((err)=>{return false});
                }
                else return false
            }).catch((err)=>{return false});
       }
    else return false
      
}

function userSignupValidator(req){
    if(req.body.salutation && req.body.firstname && req.body.lastname){

    }
    else return false;
}