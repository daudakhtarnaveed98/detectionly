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

// Function to check if required data for user registration is provided.
async function checkIfAllDataProvided(userRegistrationData) {
    for (let key of Object.keys(userRegistrationData)) {
        if (userRegistrationData[key] == null || userRegistrationData[key] === "") {
            return [false, {statusCode: "406 Not Acceptable", responseMessage: key + " Cannot be null."}]
        }
    }
    return [true, {statusCode: "202 Accepted", responseMessage: "All Data Is Provided."}]
}

// Export.
exports.checkIfExists = checkIfExists;
exports.checkIfAllDataProvided = checkIfAllDataProvided;