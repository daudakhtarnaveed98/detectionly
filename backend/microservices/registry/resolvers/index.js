'use strict';

// Require modules.
const mutation = require('./mutation');
const query = require('./query');

// Export.
exports.registerUserResolver = mutation.registerUserResolver;
exports.updateUserInformationResolver = mutation.updateUserInformationResolver;
exports.updateUserPasswordResolver = mutation.updateUserPasswordResolver;
exports.deleteUserAccountResolver = mutation.deleteUserAccountResolver;
exports.loginUserResolver = query.loginUserResolver;