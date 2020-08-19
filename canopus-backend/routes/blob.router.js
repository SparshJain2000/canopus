
const { FileService } = require("azure-storage");

const router = require("express").Router(),
    middleware = require("../middleware/index"),
    { BlobServiceClient } = require("@azure/storage-blob"),
    azure = require("azure-storage");
require("dotenv").config();
AZURE_STORAGE_CONNECTION_STRING =
    process.env.AZURE_STORAGE_CONNECTION_STRING || "";

var blobService = azure.createBlobService();
function generateSasToken(container, blobName, permissions) {
    var connString = process.env.AzureWebJobsStorage;

    // Create a SAS token that expires in an hour
    // Set start time to five minutes ago to avoid clock skew.
    var startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 60);

    permissions = permissions || azure.BlobUtilities.SharedAccessPermissions.READ;

    var sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: permissions,
            Start: startDate,
            Expiry: expiryDate
        }
    };
    
    var sasToken = blobService.generateSharedAccessSignature(container, blobName, sharedAccessPolicy);
    
    return {
        token: sasToken,
        uri: blobService.getUrl(container, blobName, sasToken, true)
    };
}

router.post("/",middleware.isLoggedIn,(req,res) =>{
    const content=req.body.context;
    const id=req.user._id;
    const filename=content+'-'+id;
    console.log(id);
    res.send(generateSasToken('user-image',filename));

})
router.post("/manual", (req, res) => {
    const container = "user-image";
    var rawdata = req.body.file;
    // console.log(rawdata);
    var matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var type = matches[1];
    var buffer = new Buffer(matches[2], "base64");
    console.log(buffer);
    blobService.createBlockBlobFromText(
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
