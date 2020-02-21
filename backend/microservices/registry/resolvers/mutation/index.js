'use strict';

// Require modules.
const registration = require('./registration');
const update = require('./update');
const deletion = require('./deletion');

// Export.
exports.registerUserResolver = registration.registerUser;
exports.updateUserInformationResolver = update.updateUserInformation;
exports.updateUserPasswordResolver = update.updateUserPassword;
exports.deleteUserAccountResolver = deletion.deleteUserAccount;