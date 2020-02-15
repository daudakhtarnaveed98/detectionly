'use strict';

// Require modules.
const { registerUserResolver, updateUserDataResolver } = require('./mutation-resolvers');

// Export.
exports.registerUserResolver = registerUserResolver;
exports.updateUserDataResolver = updateUserDataResolver;
