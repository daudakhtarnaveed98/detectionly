"use strict";

// Require modules.
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
            const userDir = process.env.PERM_FILE_UPLOAD_PATH + req.emailAddress + "/";

            // Get image path from query parameters.
            let {imagePath} = req.query;

            // Concat above information to make path for image.
            imagePath = userDir + imagePath;

            // Options for sendFile.
            const options = {root: __dirname + "../../../../"};

            // Send OK response with image.
            res.status(200).sendFile(imagePath, options);
        }
    });
}

// Export.
exports.getImage = getImage;