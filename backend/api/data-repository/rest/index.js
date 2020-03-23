"use strict";

// Require modules.
const imageUploader = require("./upload-images");
const imageDeleter = require("./delete-images");

// Export.
exports.uploadImages = imageUploader.uploadImages;
exports.deleteImage = imageDeleter.deleteImage;