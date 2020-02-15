'use strict';

// Require modules.
const { registerUserResolver, updateUserDataResolver, updateUserPassword } = require('./mutation-resolvers');

// Export.
exports.registerUserResolver = registerUserResolver;
exports.updateUserDataResolver = updateUserDataResolver;
exports.updateUserPasswordResolver = updateUserPassword;
