const router = require("express").Router(),
    middleware = require("../middleware/index"),
    Employer = require("../models/employer.model"),
    Tag = require("../models/tag.model"),
    Job = require("../models/job.model"),
    Freelance = require("../models/freelance.model");
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
router.get("/validate",(req,res) => {
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

router.post("/validate",(req,res) => {
        ID=req.body.id;
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
// delete everything related to an employer
router.post("/nuke/:id",(req,res)=>{

})
module.exports = router;
//Testing valodation code this doesnt work but is more efficient
// Employer.aggregate([{ $project:{"validated" :{ $cond: {
//     if: { $eq: [truth , "$validated" ] },
//     then: "$$REMOVE",
//     else: "$validated"
//  }}}}