"use strict";

// Require modules.
const utils = require("./utils");
const mailer = require("./mailer");

// Export.
exports.checkIfUserRecordExistsInDatabase = utils.checkIfUserRecordExistsInDatabase;
exports.getUserFromDatabase = utils.getUserFromDatabase;
exports.checkIfAllUserRegistrationDataIsProvided = utils.checkIfAllUserRegistrationDataIsProvided;
exports.saveUserToDatabase = utils.saveUserToDatabase;
exports.authenticateUser = utils.authenticateUser;
exports.concatenateSchemas = utils.concatenateSchemas;
exports.isActivated = utils.isActivated;
exports.sendActivationEmail = utils.sendActivationEmail;
exports.transporter = mailer.transporter;
exports.sendPasswordResetEmail = utils.sendPasswordResetEmail;
