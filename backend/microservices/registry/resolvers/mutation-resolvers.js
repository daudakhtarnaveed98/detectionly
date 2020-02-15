'use strict';

// Require modules.
const { User } = require('../models');
const { hash } = require('bcryptjs');

// Define resolver functions.
// For user registration.
async function registerUser(userRegistrationData) {
    // Hash password.
    try {
        userRegistrationData.password = await hash(userRegistrationData.password, 12);
    } catch (error) {
        console.log(error);
    }

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
    try {
        const result = await userToRegister.save();
        return {...result._doc, password: null};
    } catch (error) {
        console.log(error);
    }
}

// For user update.
async function updateUserData(userUpdateData) {
    // Conditions to find user.
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
    try {
        const result = await User.findOneAndUpdate(conditions, update, options).exec();
        return { ...result._doc, password:null};
    } catch (error) {
        console.log(error);
    }
}

// For password update.
async function updateUserPassword(userUpdatePasswordData) {
    // Hash password.
    try {
        userUpdatePasswordData.newPassword = await hash(userUpdatePasswordData.newPassword, 12);
    } catch (error) {
        console.log(error);
    }

    // Conditions to find user.
    const conditions = {
        emailAddress: userUpdatePasswordData.emailAddress
    };

    // Update data.
    const update = {
        password: userUpdatePasswordData.newPassword
    };

    // Options.
    const options = {
        useFindAndModify:false,
        new: true
    };

    // Find and update user.
    try {
        const result = await User.findOneAndUpdate(conditions, update, options).exec();
        return { _id: result._doc._id, statusCode:"200", responseMessage:"OK"};
    } catch (error) {
        console.log(error);
    }
}

// Export.
exports.registerUserResolver = registerUser;
exports.updateUserDataResolver = updateUserData;
exports.updateUserPassword = updateUserPassword;