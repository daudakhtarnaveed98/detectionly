// Use strict mode.
"use strict";

// Require libraries and modules.
require("dotenv-expand")(require("dotenv").config());
const fs = require("fs");
const path = require("path");

// Function to locate images.
function locateImages(detectionly) {
  // Route to locate images.
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

    // Generate user data directory path.
    const { PERM_FILE_UPLOAD_PATH } = process.env;
    const userDataDirectory = path.join(
      __dirname,
      "../../../",
      PERM_FILE_UPLOAD_PATH,
      req.emailAddress
    );

    // Check if it exists, if not return NOT FOUND response.
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

        // Variable to hold response.
        let response = [];

        // For each folder containing image pair, get paths of images.
        userUploadedImagesPairFolders.forEach(
          (currentFolderContainingImagePair) => {
            // Create a response object with current folder name, array to hold paths of images in it and image count.
            const responseObject = {
              folderName: currentFolderContainingImagePair,
              imagePaths: [],
              imageCount: 0,
            };

            // Read current folder containing images.
            fs.readdirSync(
              path.join(userDataDirectory, currentFolderContainingImagePair)
            ).forEach((userUploadedCurrentImagePath) => {
              // For each image in current folder, generate its absolute path and push it to response object image paths array.
              responseObject.imagePaths.push(
                path.join(
                  currentFolderContainingImagePair,
                  userUploadedCurrentImagePath
                )
              );

              // Increase image count by one.
              responseObject.imageCount += 1;
            });

            // Push response object to response.
            response.push(responseObject);
          }
        );

        // Return OK response with paths in body.
        return res.status(200).send({
          statusMessage: "OK",
          responseMessage: "Images Retrieved",
          userUploadedImages: response,
        });
      }
    );
  });
}

// Export.
exports.locateImages = locateImages;
