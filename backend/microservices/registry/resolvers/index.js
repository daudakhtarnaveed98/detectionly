'use strict';

// Require modules.
const { registerUserResolver, updateUserDataResolver,
        updateUserPassword, deleteUser } = require('./mutation-resolvers');

// Export.
exports.registerUserResolver = registerUserResolver;
exports.updateUserDataResolver = updateUserDataResolver;
exports.updateUserPasswordResolver = updateUserPassword;
exports.deleteUserResolver = deleteUser;
