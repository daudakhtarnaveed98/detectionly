// Use strict mode.
"use strict";

// Require libraries and modules.
const fs = require("fs");
const path = require("path");
const { PythonShell } = require("python-shell");
require("dotenv-expand")(require("dotenv").config());

// Function to detect changes in image pair.
function detectChange(detectionly) {
  // Route to get image.
  detectionly.get("/api/v1/change-detector/", function (req, res) {
    // Get isAuthorized from req.
    const isAuthorized = req.isAuthorized;

    // If isAuthorized === false, return UNAUTHORIZED response.
    if (isAuthorized === false) {
      return res
        .status(401)
        .send({
          statusMessage: "UNAUTHORIZED",
          responseMessage: "Invalid Token",
        });
    }

    // Get image pair folder name, and invalidate current flag from query parameters of req.
    const { imagePairFolderName, invalidateCurrent } = req.query;

    // If image pair folder name is not given, return BAD REQUEST response.
    if (
      !imagePairFolderName ||
      imagePairFolderName === "" ||
      imagePairFolderName === null
    ) {
      return res
        .status(400)
        .send({
          statusMessage: "BAD REQUEST",
          responseMessage: "Invalid Image Pair Folder Name",
        });
    }

    // Generate image pair folder absolute path using image pair folder name.
    const { PERM_FILE_UPLOAD_PATH } = process.env;
    const imagePairFolderPathAbsolute = path.join(
      __dirname,
      "../../../",
      PERM_FILE_UPLOAD_PATH,
      req.emailAddress,
      imagePairFolderName
    );

    // Check if image pair folder exists, if not, return NOT FOUND response.
    if (!fs.existsSync(imagePairFolderPathAbsolute)) {
      return res
        .status(404)
        .send({
          statusMessage: "NOT FOUND",
          responseMessage: "Image Pair Folder Not Found",
        });
    }

    // Get image pair paths using image pair folder absolute path.
    const imagePairPaths = fs
      .readdirSync(imagePairFolderPathAbsolute)
      .map((currentImageName) => {
        return path.join(imagePairFolderPathAbsolute, currentImageName);
      });

    // If image pair paths are not found i.e array length is 0, return NOT FOUND response.
    if (imagePairPaths.length === 0) {
      return res
        .status(404)
        .send({
          statusMessage: "NOT FOUND",
          responseMessage: " Image Pair Folder Has No Images",
        });
    }

    // If image pair has already been inferred i.e array length is 3 and invalidate current flag is not true, return already generated change map.
    if (imagePairPaths.length === 3 && invalidateCurrent !== "true") {
      // Read change map, convert to base64.
      const base64 = fs
        .readFileSync(path.join(imagePairFolderPathAbsolute, "z-map.jpg"))
        .toString("base64");

      // Construct image.
      const image = "data:image/jpeg;base64," + base64;

      // Send OK response with image.
      return res.status(200).send(image);
    }

    // Generating new change map in case if image pair has not been inferred or invalidate current flag is true.
    // Change directory to one containing run shell script.
    const modelScriptPath = path.join(__dirname, "../model/");
    process.chdir(modelScriptPath);

    // Options for python script.
    const options = {
      mode: "text",
      pythonOptions: ["-u"],
      scriptPath: modelScriptPath,
      args: [imagePairPaths[0], imagePairPaths[1], imagePairFolderPathAbsolute],
    };

    // Run python script.
    PythonShell.run("app.py", options, (error) => {
      // In case of error, throw.
      if (error) {
        throw error;
      }

      // Read change map, convert to base64.
      const base64 = fs
        .readFileSync(path.join(imagePairFolderPathAbsolute, "z-map.jpg"))
        .toString("base64");

      // Construct image.
      const image = "data:image/jpeg;base64," + base64;

      // Send OK response with image.
      return res.status(200).send(image);
    });
  });
}

// Export.
exports.detectChange = detectChange;
