"use strict";

// Require modules.
const fs = require("fs");
const path = require("path");
require("dotenv-expand")(require("dotenv").config());

// Function to delete an image.
function deleteImagePair(detectionly) {
    // Route to delete image.
    detectionly.delete("/api/v1/repository/delete/", function (req, res) {
        // Get isAuthorized from req.
        const isAuthorized = req.isAuthorized;

        // If isAuthorized === false, clean temporary upload directory, and return UNAUTHORIZED response.
        if (isAuthorized === false) {
            res.status(401).send({"statusMessage": "UNAUTHORIZED", "responseMessage": "Invalid / Expired Token"});
        }
        // Else get image to delete from request body and delete.
        else {
            const {nameOfImagePairFolder} = req.query;
            const imagePairToDelete = path.join(__dirname, "../../../", process.env.PERM_FILE_UPLOAD_PATH, req.emailAddress, nameOfImagePairFolder);

            // If image pair folder name is not provided as query parameter.
            if (nameOfImagePairFolder === null || nameOfImagePairFolder === "") {
                // Return BAD REQUEST response.
                res.status(400).send({"statusMessage": "BAD REQUEST", "responseMessage": "Image Pair Folder Name Cannot Be Empty"});
            }
            else {
                // Check if image pair folder exists on filesystem.
                fs.access(imagePairToDelete, fs.constants.F_OK, (error) => {
                    // If image does not exist.
                    if (error) {
                        // Return NOT FOUND response.
                        res.status(404).send({"statusMessage": "NOT FOUND", "responseMessage": "Image Pair Folder Not Found"});
                    } else {
                        // If image pair folder exists, remove and all files in it.
                        fs.rmdir(imagePairToDelete, {recursive: true}, (error) => {
                            // If error in removal, return INTERNAL SERVER ERROR response.
                            if (error) {
                                res.status(500).send({"statusMessage": "INTERNAL SERVER ERROR", "responseMessage": "Cannot Delete Image Pair"});
                            } else {
                                // Return OK response.
                                res.status(200).send({"statusMessage": "OK", "responseMessage": "Image Pair Deletion Successful"});
                            }
                        });
                    }
                });
            }
        }
    });
}

// Export.
exports.deleteImagePair = deleteImagePair;