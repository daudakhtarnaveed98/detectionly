"use strict";

// Require modules.
const path = require("path");
require("dotenv-expand")(require("dotenv").config());

// Function to get image.
function getImage(detectionly) {
    // Route to get image.
    detectionly.get("/api/v1/repository/get/", function (req, res) {

        // Get isAuthorized from req.
        const isAuthorized = req.isAuthorized;

        // If isAuthorized === false, return UNAUTHORIZED response.
        if (isAuthorized === false) {
            res.status(401).send({"statusMessage": "UNAUTHORIZED", "responseMessage": "Invalid Token"});
        }
        // Else get images associated with that user.
        else {
            // Get user directory.
            const userDataDirectory = path.join(__dirname, "../../../", process.env.PERM_FILE_UPLOAD_PATH, req.emailAddress);

            // Get image path from query parameters.
            let {imagePath} = req.query;

            // Send OK response with image.
            res.status(200).sendFile(path.join(userDataDirectory, imagePath));
        }
    });
}

// Export.
exports.getImage = getImage;