const {
    FileService
} = require("azure-storage");

const router = require("express").Router(),
    middleware = require("../middleware/index"),
    {
        BlobServiceClient
    } = require("@azure/storage-blob"),
    azure = require("azure-storage");
require("dotenv").config();
AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || "";



var blobService = azure.createBlobService();

router.post("/", (req, res) => {
    const container='user-image';
    var rawdata = req.body.file;
    var matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var type = matches[1];
    var buffer = new Buffer(matches[2], 'base64');
    console.log(buffer);
    blobService.createBlockBlobFromText(container,
        req.body.name,
        buffer, {
            contentSettings: {
                contentType: type
                //contentEncoding: 'base64'
            }
        },
        function (error, result, response) {
            if (error) {
                res.send(error);
            } else res.send(JSON.stringify("https://canopus.blob.core.windows.net/user-image/"+req.body.name));
            console.log("result", result);
            console.log("response", response);
        });

});


module.exports = router;