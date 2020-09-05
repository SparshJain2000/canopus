const Employer = require("../models/employer.model"),
Profession = require("../models/profession.model"),
Specialization = require("../models/specialization.model"),
SuperSpecialization = require("../models/superSpecialization.model"),
Job = require("../models/job.model"),
Freelance = require("../models/freelance.model");

async function EmployerProfileUpdateBuilder(req){
    var query={};
    query.update={};
    if(req.body.firstname) query.update["firstname"]=req.body.firstname;
    if(req.body.lastname) query.update["lastname"]=req.body.lastname;
    if(req.body.phone) query.update["phone"]=req.body.phone;
    if(req.body.logo) query.update["logo"]=req.body.logo;
    if(req.body.institutename) query.update["instituteName"]=req.body.institutename;
    if(req.body.specialty) query.update["specialty"]=req.body.specialty;
    if(req.body.links) query.update["links"]=req.body.links
    if(req.body.image) query.update["image"]=req.body.image;
    if(req.body.address) query.update["address"]=req.body.address;
    if(req.body.description) query.update["description"]=req.body.description;
    if(req.body.youtube) query.update["youtube"]=req.body.youtube;
    query.update["lastUpdated"]=Date.now();
    //console.log(query.update);

    return query;
}

async function UserProfileUpdateBuilder(req){
    var query={};
    query.update={};
    if(req.body.salutation) query.update["salutation"]=req.body.salutation;
    if(req.body.firstname) query.update["firstname"]=req.body.firstname;
    if(req.body.lastname) query.update["lastname"]=req.body.lastname;
    if(req.body.phone) query.update["phone"]=req.body.phone;
    if(req.body.profession) query.update["profession"]=req.body.profession;
    if(req.body.specialization) query.update["specialization"]=req.body.specialization;
    if(req.body.superSpecialization) query.update["superSpecialization"]=req.body.superSpecialization;
    if(req.body.experience) query.update["experience"]=req.body.experience;
    if(req.body.resume) query.update["resume"]=req.body.resume;
    if(req.body.image) query.update["image"]=req.body.image;
    if(req.body.address) query.update["address"]=req.body.address;
    if(req.body.description) query.update["description"]=req.body.description;
    if(req.body.availability) query.update["availability"]=req.body.availability;
    if(req.body.education) query.update["education"]=req.body.education;
    query.update["lastUpdated"]=Date.now();
    //console.log(query.update);

    return query;
}
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

function userUpdateValidator(req){
    if(req.body.salutation && req.body.firstname && req.body.lastname){
        if(req.body.profession)
            console.log("Helo");
        else return false;
    }
    else return false;
}
const validationController={};
exports.validationController={EmployerProfileUpdateBuilder,UserProfileUpdateBuilder};