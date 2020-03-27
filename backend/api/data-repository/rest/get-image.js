"use strict";

// Require modules.
const fs = require("fs");
const path = require("path");
require("dotenv-expand")(require("dotenv").config());

// Function to get image.
function getImage(detectionly) {
    // Route to get image.
    detectionly.get("/api/v1/repository/get/", function (req, res) {
        // Get isAuthorized from req, imagePath from req.query.
        const isAuthorized = req.isAuthorized;
        const {imagePath} = req.query;

        // If isAuthorized === false, return UNAUTHORIZED response.
        if (isAuthorized === false) {
            return res.status(401).send({"statusMessage": "UNAUTHORIZED", "responseMessage": "Invalid Token"});
        }

        // If imagePath === null || "" || undefined, return UNAUTHORIZED response.
        if (imagePath === null || imagePath === "" || !imagePath) {
            return res.status(400).send({"statusMessage": "BAD REQUEST", "responseMessage": "Image Path Cannot Be Empty"});
        }

        // Image complete path.
        const image = path.join(__dirname, "../../../", process.env.PERM_FILE_UPLOAD_PATH, req.emailAddress, imagePath);

        // If image does not exist.
        if (!fs.existsSync(image)) {
            return res.status(404).send({"statusMessage": "NOT FOUND", "responseMessage": "Image Not Found"});
        }

        // Send OK response with image.
        return res.status(200).sendFile(image);
    });
}

// Export.
exports.getImage = getImage;