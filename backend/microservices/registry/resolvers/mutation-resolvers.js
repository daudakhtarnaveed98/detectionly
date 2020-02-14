'use strict';

// Require modules.
const { User } = require('../models');

// Define resolver functions.
function registerUser(userRegistrationData) {
    // Create user based on model.
    const userToRegister = new User({
        emailAddress: userRegistrationData.emailAddress,
        password: userRegistrationData.password,
        firstName: userRegistrationData.firstName,
        lastName: userRegistrationData.lastName
    });

    // Save user to database.
    userToRegister
        .save()
        .then(result => {
            return { ...result._doc };
        })
        .catch(error => {
            throw error;
        });
    return userToRegister;
}

// Export.
exports.registerUserResolver = registerUser;