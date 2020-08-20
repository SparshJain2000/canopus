
const { FileService } = require("azure-storage"),
    { BlobServiceClient } = require("@azure/storage-blob"),
    azure = require("azure-storage");
require("dotenv").config();
const AZURE_STORAGE_CONNECTION_STRING =process.env.AZURE_STORAGE_CONNECTION_STRING || "";

var blobService = azure.createBlobService();

function generateSasToken(container, blobName, permissions) {
    var connString = process.env.AzureWebJobsStorage;

    // Create a SAS token that expires in an hour
    // Set start time to five minutes ago to avoid clock skew.
    var startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 60);

    permissions = permissions || azure.BlobUtilities.SharedAccessPermissions.WRITE;

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

exports.blobService= blobService;
exports.generateSasToken=generateSasToken;