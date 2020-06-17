// Use strict mode.
"use strict";

// Require libraries and modules.
const fs = require("fs");
const path = require("path");
require("dotenv-expand")(require("dotenv").config());

// Function to get image.
function getImage(detectionly) {
  // Route to get image.
  detectionly.get("/api/v1/repository/get/", function (req, res) {
    // Get isAuthorized from req, imagePath from req.query.
    const isAuthorized = req.isAuthorized;
    const { imagePath } = req.query;

    // If isAuthorized === false, return UNAUTHORIZED response.
    if (isAuthorized === false) {
      return res
        .status(401)
        .send({
          statusMessage: "UNAUTHORIZED",
          responseMessage: "Invalid Token",
        });
    }

    // If imagePath === null || "" || undefined, return BAD REQUEST response.
    if (imagePath === null || imagePath === "" || !imagePath) {
      return res
        .status(400)
        .send({
          statusMessage: "BAD REQUEST",
          responseMessage: "Image Path Cannot Be Empty",
        });
    }

    // Construct complete path of image.
    const { PERM_FILE_UPLOAD_PATH } = process.env;
    const image = path.join(
      __dirname,
      "../../../",
      PERM_FILE_UPLOAD_PATH,
      req.emailAddress,
      imagePath
    );

    // If image does not exist, send NOT FOUND response.
    if (!fs.existsSync(image)) {
      return res
        .status(404)
        .send({
          statusMessage: "NOT FOUND",
          responseMessage: "Image Not Found",
        });
    }

    // Read image, convert to base64.
    const base64 = fs.readFileSync(image).toString("base64");
    const imageBase64 = "data:image/jpeg;base64," + base64;

    // Send OK response with image.
    return res.status(200).send(imageBase64);
  });
}

// Export.
exports.getImage = getImage;
