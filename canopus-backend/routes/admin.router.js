const router = require("express").Router(),
    middleware = require("../middleware/index"),
    Employer = require("../models/employer.model"),
    User = require("../models/user.model"),
    Tag = require("../models/tag.model"),
    Job = require("../models/job.model"),
    Freelance = require("../models/freelance.model"),
	savedJob =require("../models/savedJobs.model"),
    savedFreelance = require("../models/savedFreelance.model");

const crypto = require('crypto');
const { promisify } = require('util');
const asyncify = require('express-asyncify');
// add new tag

//Work in progress TODO admin model
router.post("/tag",middleware.isAdmin, (req, res) => {
    const tag = new Tag({
        uber:req.body.uber,
        specialization:req.body.specialization,
        description:req.body.description
    });
    Tag.register(tag, req.body.password)
        .then((user) => {
            passport.authenticate("user")(req, res, () => {
                res.json({ user: user });
            });
        })
        .catch((err) => res.status(400).json({ err: err }));
});
//===
//Get unvalidated recruiters
router.get("/validate/employer",(req,res) => {
    Employer.aggregate([{ 
        $match:{
            validated:false
        }
     }],(err, employer) => {
    if (err)
        res.status(400).json({
            err: err,
        });
    else res.json({ employer:employer});
},);

});

router.post("/validate/employer",(req,res) => {
        let ID=req.body.id;
        //console.log(ID);
//         Job.updateMany({title:{$ne:""}},
// {$set:{validated:"true"}}).then(console.log("Hello"));
        Employer.updateMany({_id:{$in:ID}},{$set:{validated:true}},{nModified:1}).then((employer) =>{
            Job.updateMany({"author.id":{$in:ID}},{$set:{validated:true}}).then((jobs) =>{
                Freelance.updateMany({"author.id":{$in:ID}},{$set:{validated:true}}).then((freelance) =>{
                    res.json({employer:employer,jobs:jobs,freelance:freelance});
                }).catch((err) => {res.json({err:err})});
            }).catch((err) => {res.json({err:err})});
            }).catch((err) => {res.json({err:err})});

});

router.get("/validate/user",(req,res) => {
    User.aggregate([{ 
        $match:{
            validated:false
        }
     }],(err, employer) => {
    if (err)
        res.status(400).json({
            err: err,
        });
    else res.json({ employer:employer});
},);

});

router.post("/validate/user",(req,res) => {
        ID=req.body.id;
        //console.log(ID);
//         Job.updateMany({title:{$ne:""}},
// {$set:{validated:"true"}}).then(console.log("Hello"));
        User.updateMany({_id:{$in:ID}},{$set:{validated:true}},{nModified:1}).then((employer) =>{
            Job.updateMany({"author.id":{$in:ID}},{$set:{validated:true}}).then((jobs) =>{
                Freelance.updateMany({"author.id":{$in:ID}},{$set:{validated:true}}).then((freelance) =>{
                    res.json({employer:employer,jobs:jobs,freelance:freelance});
                }).catch((err) => {res.json({err:err})});
            }).catch((err) => {res.json({err:err})});
            }).catch((err) => {res.json({err:err})});

});
async function tokenGen(){

    const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
    return token;
}
//add jobs for employer
router.post("/add/jobs" , async (req,res)=>{

   // console.log(await tokenGen());
    //const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
    let promises = [];
    let newLogins={};
    let jobs=req.body.jobs;
    console.log(jobs);
    for (let i = 0; i < jobs.length; i++) {
        promises.push(
            new Promise((resolve, reject) => {


               // const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
                const author=jobs[i].email;
                 Employer.findOne({username:author}).then((employer)=>{
                        // const expiry=new Date(req.body.jobs[i].expireAt);
                        // var days=(expiry-Date.now())/(1000*60*60*24);
                        // if(days<0 || days>90 )
                        // return res.status(400).json({err:"Invalid time format"});
                        // if(employer.jobtier.allowed-employer.jobtier.posted<=0)
                        // return res.status(400).json({err:"Max Jobs Posted"});
                        var expiry= new Date();
                        expiry.setDate(expiry.getDate() + 45);
                        var description={};
                        if(jobs[i].line)description.line=jobs[i].line;
                        if(jobs[i].about)description.about=jobs[i].about;
                        if(jobs[i].experience)description.experience=jobs[i].experience;
                        if(jobs[i].incentives)description.incentives=jobs[i].incentives;
                        if(jobs[i].type)description.type=jobs[i].type;
                        if(jobs[i].location)description.location=jobs[i].location;
                        if(jobs[i].skills)description.skills=jobs[i].skills;
                        if(jobs[i].salary)description.salary=jobs[i].salary;
                        if(jobs[i].count)description.count=jobs[i].count;
                        if(employer.instituteName) description.company=employer.instituteName;
                        let job = new Job({
                            title: jobs[i].title,
                            profession: jobs[i].profession,
                            specialization: jobs[i].specialization,
                            superSpecialization:jobs[i].superSpecialization,
                            description: description,
                           // address: req.body.jobs[i].address,
                            createdAt:new Date(),
                            createdBy:"Employer",
                            expireAt:expiry,
                            validated:employer.validated,
                            extension:1,
                        });
                        Job.create(job)
                        .then((job) => {
                            job.author.username = employer.username;
                             job.author.id = employer._id;
                            //if(employer.instituteName){console.log("Hello");
                            job.author.instituteName = employer.instituteName;
                           // if(employer.logo)
                            job.author.photo = employer.logo;
                           // if(employer.description.about) 
                            //// job.author.about = employer.description.about;
                           // console.log(job);
                            job.save()
                            .then((job) => {
                                //let sJob= new savedJob()
                                let sjob = new savedJob({
                                    jobRef:job._id,
                                    status:"Active",
                                    author:job.author,
                                    title: jobs[i].title,
                                    profession: jobs[i].profession,
                                    specialization: jobs[i].specialization,
                                    superSpecialization:jobs[i].superSpecialization,
                                    description: description,
                                // address: req.body.jobs[i].address,
                                    createdAt:new Date(),
                                    createdBy:"Employer",
                                    expireAt:expiry,
                                    validated:employer.validated,
                                    extension:1,
                                });
                                savedJob.create(sjob).then((sjob) =>{
                                    employer.jobtier.posted+=1;
                                    employer.jobs = [
                                    ...employer.jobs,
                                    {
                                        title: job.title,
                                        id: job._id,
                                        sid:sjob._id,
                                    },
                                    ];
                                    employer
                                    .save().then((updatedEmployer)=>{
                                        console.log(updatedEmployer);
                                        resolve("Done")
                                    }).catch((err)=>{res.status(500).json({err:"Error saving employer jobs"})});
                               // }).catch((err)=>{res.status(500).json({err:"Employer email invalid"})});
                                }).catch((err)=>{res.status(500).json({err:"Error creating sjob"})});
                            }).catch((err)=>{res.status(500).json({err:"Error saving job"})});
                        }).catch((err)=>{res.status(500).json({err:"Error creating job"})});
                    //}).catch((err)=>{res.status(500).json({err:"Employer email invalid"})});
                    })
                .catch((err)=>{


                   // const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
                    const employer = new Employer({
                        username: author,
                        role: "Employer",
                        jobtier: {
                            allowed: 10,
                            posted: 0,
                            saved:0,
                            closed: 0,
                        },
                        freelancetier:{
                            allowed:3,
                            posted:0,
                            saved:0,
                            closed:0,
                        },
                        locumtier:{
                            allowed:1,
                            posted:0,
                            saved:0,
                            closed:0,
                        },
                        sponsors:{
                            allowed:1,
                            posted:0
                        },
                        validated: true,
                        createdAt:Date.now()
                    });
                    tokenGen().then((token)=>{
                   // const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
                   // const token = asyncify.promisify(crypto.randomBytes)(20).toString('hex').then((token)=>{
                    Employer.register(employer, token)
                        .then((employer) => {
                            console.log(employer);
                                    const expiry=new Date(req.body.jobs[i].expireAt);
                                    var days=(expiry-Date.now())/(1000*60*60*24);
                                    if(days<0 || days>90 )
                                    return res.status(400).json({err:"Invalid time format"});
                                    if(employer.jobtier.allowed-employer.jobtier.posted<=0)
                                    return res.status(400).json({err:"Max Jobs Posted"});
                                    var description={};
                                    if(jobs[i].line)description.line=jobs[i].line;
                                    if(jobs[i].about)description.about=jobs[i].about;
                                    if(jobs[i].experience)description.experience=jobs[i].experience;
                                    if(jobs[i].incentives)description.incentives=jobs[i].incentives;
                                    if(jobs[i].type)description.type=jobs[i].type;
                                    if(jobs[i].location)description.location=jobs[i].location;
                                    if(jobs[i].skills)description.skills=jobs[i].skills;
                                    if(jobs[i].salary)description.salary=jobs[i].salary;
                                    if(jobs[i].count)description.count=jobs[i].count;
                                    //description.company=employer.instituteName;
                                    let job = new Job({
                                        title: req.body.jobs[i].title,
                                        profession: req.body.jobs[i].profession,
                                        specialization: req.body.jobs[i].specialization,
                                        superSpecialization:req.body.jobs[i].superSpecialization,
                                        description: description,
                                       // address: req.body.jobs[i].address,
                                        createdAt:new Date(),
                                        createdBy:"Employer",
                                        expireAt:expiry,
                                        validated:employer.validated,
                                        extension:1,
                                    });
                                    Job.create(job)
                                    .then((job) => {
                                        job.author.username = employer.username;
                                        job.author.id = employer._id;
                                        job.author.instituteName = employer.instituteName;
                                        job.author.photo = employer.logo;
                                       // if(employer.description.about) // job.author.about = employer.description.about;
                                        //console.log(job);
                                        job.save()
                                        .then((job) => {
                                            //let sJob= new savedJob()
                                            let sjob = new savedJob({
                                                jobRef:job._id,
                                                status:"Active",
                                                author:job.author,
                                                title: jobs[i].title,
                                                profession: jobs[i].profession,
                                                specialization: jobs[i].specialization,
                                                superSpecialization:jobs[i].superSpecialization,
                                                description: description,
                                            // address: req.body.jobs[i].address,
                                                createdAt:new Date(),
                                                createdBy:"Employer",
                                                expireAt:expiry,
                                                validated:employer.validated,
                                                extension:1,
                                            });
                                            savedJob.create(sjob).then((sjob) =>{
                                                employer.jobtier.posted+=1;
                                                employer.jobs = [
                                                ...employer.jobs,
                                                {
                                                    title: job.title,
                                                    id: job._id,
                                                    sid:sjob._id,
                                                },
                                                ];
                                                employer
                                                .save().then((updatedEmployer)=>{
                                                    newLogins[updatedEmployer.username]=token;
                                                    resolve("Done");
                                                }).catch((err)=>{res.status(500).json({err:"Error saving employer jobs"})});
                                           // }).catch((err)=>{res.status(500).json({err:"Employer email invalid"})});
                                            }).catch((err)=>{res.status(500).json({err:"Error creating sjob"})});
                                        }).catch((err)=>{res.status(500).json({err:"Error saving job"})});
                                    }).catch((err)=>{res.status(500).json({err:"Error creating job"})});
                               // }).catch((err)=>{res.status(500).json({err:"Employer email invalid"})});
                            })
                            .catch((err) => res.status(400).json({ err: "Error registering employer"}));
                        }).catch((err) => res.status(400).json({ err: "Error generating token" }));
               // }).catch((err)=>console.log(err));
            });
            }),
        );
    }
    Promise.all(promises)
        .then((msg) => {
            console.log("All promises resolved");
            res.json({new:newLogins});
    })
    .catch((err) => res.json({ err:"Couldn't find employer" }));
});
// delete everything related to an employer
router.put("/nuke/:id",(req,res)=>{
    Employer.findById(req.params.id).then((employer)=>{
        // const sjob_id = employer.jobs.map(item=>{
        //     return item.sid;
        // });
        const job_id = employer.jobs.map(item=>{
            return item.id;
        });
        const fjob_id = employer.freelanceJobs.map(item=>{
            return item.id;
        });
        // const s_fjob_id = employer.freelanceJobs.map(item=>{
        //     return item.sid;
        // });
        savedJob.deleteMany({jobRef:{$in:job_id}});
        savedFreelance.deleteMany({jobRef:{$in:fjob_id}});
        Job.deleteMany({_id:{$in:job_id}});
        Freelance.deleteMany({_id:{$in:fjob_id}});
    })
})

router.get("/analytics/profession",(req,res)=>{
    Job.aggregate([
        { $sortByCount: "$description.location" }
    ]).then((results)=>{res.json({results:results})});
})
module.exports = router;
//Testing valodation code this doesnt work but is more efficient
// Employer.aggregate([{ $project:{"validated" :{ $cond: {
//     if: { $eq: [truth , "$validated" ] },
//     then: "$$REMOVE",
//     else: "$validated"
//  }}}}