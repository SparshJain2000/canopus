const router = require("express").Router(),
    middleware = require("../middleware/index"),
    Employer = require("../models/employer.model"),
    Tag = require("../models/tag.model");
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
    const truth=true;
    Employer.aggregate([{ 
        $match:{
            validated:true
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
        
})
module.exports = router;
//Testing valodation code this doesnt work but is more efficient
// Employer.aggregate([{ $project:{"validated" :{ $cond: {
//     if: { $eq: [truth , "$validated" ] },
//     then: "$$REMOVE",
//     else: "$validated"
//  }}}}