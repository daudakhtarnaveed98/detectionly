'use strict';

// Require modules.
const { User } = require('../models');

// Utility functions.
// Function to check duplicate users.
async function checkIfExists(userEmailAddress) {
    // Conditions to find user.
    const conditions = {
        emailAddress: userEmailAddress
    };

    // Find user and return.
    try {
        const result = await User.findOne(conditions).exec();
        return [result != null, result];
    } catch (error) {
        console.log(error);
    }
}

// Export.
exports.checkIfExists = checkIfExists;