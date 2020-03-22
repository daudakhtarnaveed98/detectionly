"use strict";

// Require modules.
const path = require("path");
const multer = require("multer");
require("dotenv-expand")(require("dotenv").config());

// Setup storage.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + path.extname(file.originalname));
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
    detectionly.post("/api/v1/repository/images/upload/", upload.array("images", 3), function (req, res, next) {
        const files = req.files;
        if (!files || files.length === 0) {
            const error = new Error("Please select files");
            return next(error);
        }
        res.send(files);
    });
}

// Export.
exports.uploadImages = uploadImages;