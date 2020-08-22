
const blobController=require("../controllers/blob.controller.js");
const router = require("express").Router(),
    middleware = require("../middleware/index");
router.post("/", middleware.isLoggedIn, (req, res) => {
    const content = req.body.context;
    const id = req.user._id;
    const filename = content;
    console.log(id);
    res.send(blobController.generateSasToken('user-image',filename));

})

// This route is for uploading from server without SAS

router.post("/manual", (req, res) => {
    const container = "user-image";
    var rawdata = req.body.file;
    // console.log(rawdata);
    var matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var type = matches[1];
    var buffer = new Buffer(matches[2], "base64");
    console.log(buffer);
    blobController.blobService.createBlockBlobFromText(
        container,
        req.body.name,
        buffer,
        {
            contentSettings: {
                contentType: type,
                //contentEncoding: 'base64'
            },
        },
        function (error, result, response) {
            if (error) {
                res.send(error);
            } else
                res.send(
                    JSON.stringify(
                        "https://canopus.blob.core.windows.net/user-image/" +
                            req.body.name,
                    ),
                );
            console.log("result", result);
            console.log("response", response);
        },
    );
});

module.exports = router;
