"use strict";

// Require modules.
const fs = require("fs");
const path = require("path");
require("dotenv-expand")(require("dotenv").config());

// Function to detect changes in image pair.
function detectChange(detectionly) {
    // Route to get image.
    detectionly.get("/api/v1/change-detector/", function (req, res) {

        // Get isAuthorized from req.
        const isAuthorized = req.isAuthorized;

        // If isAuthorized === false, return UNAUTHORIZED response.
        if (isAuthorized === false) {
            res.status(401).send({"statusMessage": "UNAUTHORIZED", "responseMessage": "Invalid Token"});
        }
        // Infer image through model.
        else {
            // Get image pair folder name.
            const {imagePairFolderName} = req.query;

            // Get user directory.
            const imagePairFolderPath = process.env.PERM_FILE_UPLOAD_PATH + req.emailAddress + "/" + imagePairFolderName + "/";

            // Get image pair paths.
            const imagePairPaths = fs.readdirSync(imagePairFolderPath).map((currentImageName) => {
                return imagePairFolderPath + "/" + currentImageName;
            });

            // Change directory to one containing run shell script.
            const scriptPath = path.join(__dirname + "../../model/run.sh");
            const exec = require('child_process').exec;
            exec(scriptPath);
        }
    });
}

// Export.
exports.detectChange = detectChange;