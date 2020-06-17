// Use strict mode.
"use strict";

// Require libraries and modules.
const fs = require("fs");
const path = require("path");
require("dotenv-expand")(require("dotenv").config());

// Function to delete an image pair.
function deleteImagePair(detectionly) {
  // Route to delete an image pair.
  detectionly.delete("/api/v1/repository/delete/", function (req, res) {
    // Get isAuthorized from req.
    const isAuthorized = req.isAuthorized;

    // If isAuthorized === false, return UNAUTHORIZED response.
    if (isAuthorized === false) {
      return res
        .status(401)
        .send({
          statusMessage: "UNAUTHORIZED",
          responseMessage: "Invalid / Expired Token",
        });
    }

    // Get name of image pair folder from query parameters of req and construct absolute path to it.
    const { nameOfImagePairFolder } = req.query;
    const imagePairToDelete = path.join(
      __dirname,
      "../../../",
      process.env["PERM_FILE_UPLOAD_PATH"],
      req.emailAddress,
      nameOfImagePairFolder
    );

    // If image pair folder name is not provided as query parameter, return BAD REQUEST response.
    if (nameOfImagePairFolder === null || nameOfImagePairFolder === "") {
      return res
        .status(400)
        .send({
          statusMessage: "BAD REQUEST",
          responseMessage: "Image Pair Folder Name Cannot Be Empty",
        });
    }

    // Check if image pair folder exists on filesystem.
    fs.access(imagePairToDelete, fs.constants.F_OK, (error) => {
      // If it does not exist, return NOT FOUND response.
      if (error) {
        return res
          .status(404)
          .send({
            statusMessage: "NOT FOUND",
            responseMessage: "Image Pair Folder Not Found",
          });
      }

      // Remove image pair folder recursively.
      fs.rmdir(imagePairToDelete, { recursive: true }, (error) => {
        // If error in removal, return INTERNAL SERVER ERROR response.
        if (error) {
          return res
            .status(500)
            .send({
              statusMessage: "INTERNAL SERVER ERROR",
              responseMessage: "Cannot Delete Image Pair",
            });
        }

        // Return OK response.
        return res
          .status(200)
          .send({
            statusMessage: "OK",
            responseMessage: "Image Pair Deletion Successful",
          });
      });
    });
  });
}

// Export.
exports.deleteImagePair = deleteImagePair;
