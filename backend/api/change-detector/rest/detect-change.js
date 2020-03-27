"use strict";

// Require modules.
const fs = require("fs");
const path = require("path");
const {PythonShell} = require("python-shell");
require("dotenv-expand")(require("dotenv").config());

// Function to detect changes in image pair.
function detectChange(detectionly) {
    // Route to get image.
    detectionly.get("/api/v1/change-detector/", function (req, res, next) {

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

            // Check if image pair folder name is given.
            if (!imagePairFolderName || imagePairFolderName === "" || imagePairFolderName === null) {
                return res.status(400).send({"statusMessage": "BAD REQUEST", "responseMessage": "Invalid Image Pair Folder Name"});
            }

            // Get image pair folder absolute path.
            const imagePairFolderPathAbsolute = path.join(__dirname, "../../../", process.env.PERM_FILE_UPLOAD_PATH, req.emailAddress, imagePairFolderName);

            // Get image pair paths.
            const imagePairPaths = fs.readdirSync(imagePairFolderPathAbsolute).map((currentImageName) => {
                return path.join(imagePairFolderPathAbsolute, currentImageName);
            });

            // If image pair paths are not found i.e array length is 0.
            if (imagePairPaths.length === 0) {
                return res.status(400).send({"statusMessage": "BAD REQUEST", "responseMessage": "Invalid Image Pair Folder Name"});
            }
            // If image pair has already been inferred i.e array length is 3.
            if (imagePairPaths.length === 3) {
                return res.sendFile(path.join(imagePairFolderPathAbsolute, "change-map.jpg"));
            }

            // Change directory to one containing run shell script.
            const modelScriptPath = path.join(__dirname, "../model/");
            process.chdir(modelScriptPath);

            // Options for python script.
            const options = {
                mode: "text",
                pythonOptions: ["-u"],
                scriptPath: modelScriptPath,
                args: [imagePairPaths[0], imagePairPaths[1], imagePairFolderPathAbsolute]
            };

            // Run python script.
            PythonShell.run("app.py", options, (error) => {
                if (error) {
                    throw error;
                }

                // Send change map.
                return res.sendFile(path.join(imagePairFolderPathAbsolute, "change-map.jpg"));
            });

        }
    });
}

// Export.
exports.detectChange = detectChange;