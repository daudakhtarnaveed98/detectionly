"use strict";

// Require modules.
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const multer = require("multer");
require("dotenv-expand")(require("dotenv").config());

// Setup storage.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../../", process.env.TEMP_FILE_UPLOAD_PATH));
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
    detectionly.post("/api/v1/repository/upload/", upload.array("images", 2), function (req, res, next) {
        // In case no file is selected.
        const files = req.files;
        if (!files || files.length === 0) {
            // Return NOT ACCEPTABLE response.
            res.status(406).send({"statusMessage": "NOT ACCEPTABLE", "responseMessage": "Please select images."});
            return next();
        }


        // Get isAuthorized from req.
        const isAuthorized = req.isAuthorized;

        // If isAuthorized === false, clean temporary upload directory, and return UNAUTHORIZED response.
        if (isAuthorized === false) {
            // Temp directory path.
            const imageUploadTemporaryDirectory = path.join(__dirname, "../../../", process.env.TEMP_FILE_UPLOAD_PATH);

            // Clean temporary folder.
            fs.readdir(imageUploadTemporaryDirectory, (err, files) => {
                files.forEach(file => {
                    fs.unlinkSync(path.join(imageUploadTemporaryDirectory, file));
                });
            });

            // Return UNAUTHORIZED response.
            res.status(401).send({"statusMessage": "UNAUTHORIZED", "responseMessage": "Invalid / Expired Token"});
        } else {
            // Get email address from req.
            const emailAddress = req.emailAddress;

            // Create user directory, if not exists
            const userDataDirectory = path.join(__dirname, "../../../", process.env.PERM_FILE_UPLOAD_PATH, emailAddress);
            if (!fs.existsSync(userDataDirectory)) {
                fs.mkdirSync(userDataDirectory);
            }

            // Create folder with uuid inside user directory.
            const imagesUploadPath = path.join(userDataDirectory, uuid.v4());
            if (!fs.existsSync(imagesUploadPath)) {
                fs.mkdirSync(imagesUploadPath);
            }

            // Move files to images upload path directory.
            const files = req.files;
            const filesLength = files.length;
            for (let i = 0; i < filesLength; i++) {
                const filePath = files[i].path;
                fs.rename(filePath, path.join(imagesUploadPath, files[i].originalname), (error) => {
                    if (error) throw error;
                });
            }
            // Send OK response.
            res.status(201).send({"statusMessage": "CREATED", "responseMessage": "Upload Successful", "imagesUploaded": files});
        }
    });
}

// Export.
exports.uploadImages = uploadImages;