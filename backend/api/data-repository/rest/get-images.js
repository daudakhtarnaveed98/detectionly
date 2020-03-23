"use strict";

// Require modules.
require("dotenv-expand")(require("dotenv").config());
const fs = require("fs");

// Function to get images.
function getImages(detectionly) {
    // Route to get images.
    detectionly.get("/api/v1/repository/images/get/all", function (req, res) {
        // Get isAuthorized from req.
        const isAuthorized = req.isAuthorized;

        // If isAuthorized === false, return UNAUTHORIZED response.
        if (isAuthorized === false) {
            res.status(401).send({"statusMessage": "UNAUTHORIZED", "responseMessage": "Invalid Token"});
        }
        // Else get images associated with that user.
        else {
            // Read contents of userDir.
            const userDir = process.env.PERM_FILE_UPLOAD_PATH + req.emailAddress + "/";
            const userUploadedImages = fs.readdirSync(userDir);
            const userUploadedImagesCompletePaths = userUploadedImages.map((currentImage) => {
                return userDir + currentImage;
            });

            // If no images are found in directory, return NOT FOUND response.
            if (userUploadedImagesCompletePaths.length === 0) {
                // Return NOT FOUND response.
                res.status(404).send({"statusMessage": "NOT FOUND", "responseMessage": "No Image Found", "uploadedImages": null});
            } else {
                // Return OK response with paths in body.
                res.status(200).send({"statusMessage": "OK", "responseMessage": "Images Retrieved", "uploadedImages": userUploadedImagesCompletePaths});
            }
        }
    });
}

// Export.
exports.getImages = getImages;