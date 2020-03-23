"use strict";

// Require modules.
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const multer = require("multer");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv-expand")(require("dotenv").config());

// Setup storage.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.TEMP_FILE_UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + uuid.v4() + path.extname(file.originalname));
    }
});

// Setup upload.
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        if(ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
            const error = new Error("Only images are allowed");
            return callback(error);
        }
        callback(null, true);
    },
});

// Function to upload images.
function uploadImages(detectionly) {
    // Route to upload images.
    detectionly.post("/api/v1/repository/images/upload/", upload.array("images", 2), function (req, res, next) {
        // In case no file is selected.
        const files = req.files;
        if (!files || files.length === 0) {
            const error = new Error("Please select files");
            return next(error);
        }

        // Get json web token from authorization header.
        const jwt = req.headers['authorization'].split(" ")[1];

        // Verify the provided token.
        jsonwebtoken.verify(jwt, process.env.PRIVATE_KEY, function(error, decoded) {
            // Temp directory path.
            const tempDir = process.env.TEMP_FILE_UPLOAD_PATH;

            // In case of verification fail, clean temporary error and throw error.
            if (error) {
                // Clean temporary folder.
                fs.readdir(tempDir, (err, files) => {
                    files.forEach(file => {
                        fs.unlinkSync(tempDir + file);
                    });
                });
                throw error;
            } else {
                // Get email address from decoded.
                const emailAddress = decoded.emailAddress;

                // Create directory for logged in user, if not exists.
                const userDir = process.env.PERM_FILE_UPLOAD_PATH + emailAddress + "/";
                if (!fs.existsSync(userDir)) {
                    fs.mkdirSync(userDir);
                }

                // Move files to user's directory.
                const files = req.files;
                const filesLength = files.length;
                for (let i = 0; i < filesLength; i++) {
                    const filePath = files[i].path;
                    fs.rename(filePath, userDir + files[i].filename, (error) => {
                        if (error) throw error;
                    });
                }
            }
        });
        res.status(201).send({
            "statusMessage": "CREATED",
            "responseMessage": "Upload Successful",
            "imagesUploaded": files
        });
    });
}

// Export.
exports.uploadImages = uploadImages;