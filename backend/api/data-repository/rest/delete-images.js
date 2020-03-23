"use strict";

// Require modules.
const fs = require("fs");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv-expand")(require("dotenv").config());

// Function to delete an image.
function deleteImage(detectionly) {
    // Route to delete image.
    detectionly.delete("/api/v1/repository/images/delete/", function (req, res) {
        // Get json web token from authorization header.
        const jwt = req.headers['authorization'].split(" ")[1];

        // Verify the provided token.
        jsonwebtoken.verify(jwt, process.env.PRIVATE_KEY, function(error, decoded) {
            // In case of verification fail, clean temporary error and throw error.
            if (error) {
                res.status(401).send({"statusMessage": "UNAUTHORIZED", "responseMessage": "Invalid Token"});
            }
            // Else get images to delete from request body, loop and delete.
            else {
                const userDir = process.env.PERM_FILE_UPLOAD_PATH + decoded.emailAddress + "/";
                const {nameOfImageToDelete} = req.body;
                const imageToDelete = userDir + nameOfImageToDelete;

                // Check if image exists.
                fs.access(imageToDelete, fs.constants.F_OK, (error) => {
                    // If image does not exist.
                    if (error) {
                        // Return NOT FOUND response.
                        res.status(404).send({"statusMessage": "NOT FOUND", "responseMessage": "Image Does Not Exist"});
                    } else {
                        // If image exists, unlink it.
                        fs.unlink(imageToDelete, (error) => {
                            // If error in unlink, return INTERNAL SERVER ERROR response.
                            if (error) {
                                res.status(500).send({
                                    "statusMessage": "INTERNAL SERVER ERROR",
                                    "responseMessage": "Cannot Delete Image"
                                });
                            } else {
                                // Return OK response.
                                res.status(200).send({"statusMessage": "OK", "responseMessage": "Deletion Successful"});
                            }
                        });
                    }
                });
            }
        });
    });
}

// Export.
exports.deleteImage = deleteImage;