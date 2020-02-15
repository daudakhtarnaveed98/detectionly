'use strict';

// Require modules.
const { User } = require('../models');
const { hash } = require('bcryptjs');

// Define resolver functions.
async function registerUser(userRegistrationData) {
    // Hash password.
    userRegistrationData.password = await hash(userRegistrationData.password, 12);

    // Create user based on model.
    const userToRegister = new User({
        emailAddress: userRegistrationData.emailAddress,
        password: userRegistrationData.password,
        firstName: userRegistrationData.firstName,
        lastName: userRegistrationData.lastName
    });

    // Save user to database.
    const result = await userToRegister.save();
    return {...result._doc, password: null};
}

// Export.
exports.registerUserResolver = registerUser;