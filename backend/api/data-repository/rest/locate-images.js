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
      return res.status(401).send({
        statusMessage: "UNAUTHORIZED",
        responseMessage: "Invalid / Expired Token",
      });
    }

    // Get user data directory path, check if it exists, if not return NOT FOUND response.
    const userDataDirectory = path.join(
      __dirname,
      "../../../",
      process.env.PERM_FILE_UPLOAD_PATH,
      req.emailAddress
    );
    if (!fs.existsSync(userDataDirectory)) {
      return res.status(404).send({
        statusMessage: "NOT FOUND",
        responseMessage: "User Data Directory Not Found",
        userUploadedImagesPairFolderPaths: null,
        userUploadedImagesPairPaths: null,
      });
    }

    // Read user data directory,
    fs.readdir(
      userDataDirectory,
      null,
      (error, userUploadedImagesPairFolders) => {
        // If error return INTERNAL SERVER ERROR response.
        if (error) {
          console.error(error);
          return res.status(500).send({
            statusMessage: "INTERNAL SERVER ERROR",
            responseMessage:
              "An Error Occurred While Reading User Data Directory",
            userUploadedImagesPairFolderPaths: null,
            userUploadedImagesPairPaths: null,
          });
        }

        // If no images are found in directory, return NOT FOUND response.
        if (userUploadedImagesPairFolders.length === 0) {
          return res.status(404).send({
            statusMessage: "NOT FOUND",
            responseMessage: "No Image Found",
            userUploadedImagesPairFolderPaths: null,
            userUploadedImagesPairPaths: null,
          });
        }

        // For each folder containing image pair, get paths of images.
        let userUploadedImagePairPaths = [];
        userUploadedImagesPairFolders.forEach(
          (currentFolderContainingImagePair) => {
            fs.readdirSync(
              path.join(userDataDirectory, currentFolderContainingImagePair)
            ).forEach((userUploadedCurrentImagePath) => {
              userUploadedImagePairPaths.push(
                path.join(
                  currentFolderContainingImagePair,
                  userUploadedCurrentImagePath
                )
              );
            });
          }
        );

        // Return OK response with paths in body.
        return res.status(200).send({
          statusMessage: "OK",
          responseMessage: "Images Retrieved",
          userUploadedImagesPairFolders: userUploadedImagesPairFolders,
          userUploadedImagesPairPaths: userUploadedImagePairPaths,
        });
      }
    );
  });
}

// Export.
exports.locateImages = locateImages;
