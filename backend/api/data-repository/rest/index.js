"use strict";

// Require modules.
const imageUploader = require("./upload-images");
const imageDeleter = require("./delete-image-pair");
const imageLocator = require("./locate-images");
const imageGetter = require("./get-image");

// Export.
exports.uploadImages = imageUploader.uploadImages;
exports.deleteImagePair = imageDeleter.deleteImagePair;
exports.locateImages = imageLocator.locateImages;
exports.getImage = imageGetter.getImage;