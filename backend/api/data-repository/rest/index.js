"use strict";

// Require modules.
const imageUploader = require("./upload-images");
const imageDeleter = require("./delete-image");
const imageGetter = require("./get-images");

// Export.
exports.uploadImages = imageUploader.uploadImages;
exports.deleteImage = imageDeleter.deleteImage;
exports.getImages = imageGetter.getImages;