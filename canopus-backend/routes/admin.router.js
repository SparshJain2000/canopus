const router = require("express").Router(),
    middleware = require("../middleware/index"),
    Employer = require("../models/employer.model"),
    Tag = require("../models/tag.model");
// add new tag

//Work in progress TODO admin model
router.post("/tag", (req, res) => {
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

module.exports = router;
