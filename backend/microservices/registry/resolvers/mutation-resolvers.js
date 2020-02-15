'use strict';

// Require modules.
const { User } = require('../models');
const { hash } = require('bcryptjs');

// Define resolver functions.
// For user registration.
async function registerUser(userRegistrationData) {
    // Hash password.
    userRegistrationData.password = await hash(userRegistrationData.password, 12);

    // Create user based on model.
    const userToRegister = new User({
        // Required properties.
        emailAddress: userRegistrationData.emailAddress,
        password: userRegistrationData.password,
        firstName: userRegistrationData.firstName,
        lastName: userRegistrationData.lastName,

        // Optional properties.
        gender: null,
        phoneNumber: null,
        dateOfBirth: null,
        organizationName: null,
        roleInOrganization: null
    });

    // Save user to database.
    const result = await userToRegister.save();
    return {...result._doc, password: null};
}

// For user update.
async function updateUserData(userUpdateData) {
    // Query to find user.
    const conditions = {
        emailAddress: userUpdateData.emailAddress
    };

    // Update data.
    const update = {
        firstName: userUpdateData.firstName,
        lastName: userUpdateData.lastName,
        gender: userUpdateData.gender,
        phoneNumber: userUpdateData.phoneNumber,
        dateOfBirth: userUpdateData.dateOfBirth,
        organizationName: userUpdateData.organizationName,
        roleInOrganization: userUpdateData.roleInOrganization
    };

    // Options.
    const options = {
        useFindAndModify:false,
        new: true
    };

    // Find and update user.
    const result = await User.findOneAndUpdate(conditions, update, options).exec();
    return { ...result._doc, password:null};
}

// Export.
exports.registerUserResolver = registerUser;
exports.updateUserDataResolver = updateUserData;