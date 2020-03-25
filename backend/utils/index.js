"use strict";

// Require modules.
const utils = require("./utils");

// Export.
exports.checkIfUserRecordExistsInDatabase = utils.checkIfUserRecordExistsInDatabase;
exports.getUserFromDatabase = utils.getUserFromDatabase;
exports.checkIfAllUserRegistrationDataIsProvided = utils.checkIfAllUserRegistrationDataIsProvided;
exports.saveUserToDatabase = utils.saveUserToDatabase;
exports.authenticateUser = utils.authenticateUser;
exports.concatenateSchemas = utils.concatenateSchemas;