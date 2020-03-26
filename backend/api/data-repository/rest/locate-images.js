"use strict";

// Require modules.
require("dotenv-expand")(require("dotenv").config());
const fs = require("fs");
const path = require("path");

// Function to locate images.
function locateImages(detectionly) {
    // Route to get images.
    detectionly.get("/api/v1/repository/locate/all", function (req, res) {
        // Get isAuthorized from req.
        const isAuthorized = req.isAuthorized;

        // If isAuthorized === false, return UNAUTHORIZED response.
        if (isAuthorized === false) {
            res.status(401).send({"statusMessage": "UNAUTHORIZED", "responseMessage": "Invalid / Expired Token"});
        }
        // Else get images associated with that user.
        else {
            // Try to read contents of userDir.
            const userDataDirectory = path.join(__dirname, "../../../", process.env.PERM_FILE_UPLOAD_PATH, req.emailAddress);
            let userUploadedImagesPairFolders;
            try {
                fs.readdirSync(userDataDirectory);
            } catch (error) {
                // Directory does not exist, create one.
                if (!fs.existsSync(userDataDirectory)) {
                    fs.mkdirSync(userDataDirectory);
                }
            } finally {
                // Read contents again (in newly created directory).
                userUploadedImagesPairFolders = fs.readdirSync(userDataDirectory);
            }

            // If no images are found in directory, return NOT FOUND response.
            if (userUploadedImagesPairFolders.length === 0) {
                // Return NOT FOUND response.
                res.status(404).send({"statusMessage": "NOT FOUND", "responseMessage": "No Image Found", "userUploadedImagesPairFolderPaths": null, "userUploadedImagesPairPaths": null});
            } else {
                // For each folder containing image pair, get paths of images.
                let userUploadedImagePairPaths = [];
                userUploadedImagesPairFolders.forEach((currentFolderContainingImagePair) => {
                    fs.readdirSync(path.join(userDataDirectory, currentFolderContainingImagePair)).forEach((userUploadedCurrentImagePath) => {
                        userUploadedImagePairPaths.push(path.join(currentFolderContainingImagePair, userUploadedCurrentImagePath));
                    });
                });

                // Return OK response with paths in body.
                res.status(200).send({"statusMessage": "OK", "responseMessage": "Images Retrieved", "userUploadedImagesPairFolders": userUploadedImagesPairFolders, "userUploadedImagesPairPaths": userUploadedImagePairPaths});
            }
        }
    });
}

// Export.
exports.locateImages = locateImages;