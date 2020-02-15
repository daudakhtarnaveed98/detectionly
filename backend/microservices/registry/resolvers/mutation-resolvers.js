'use strict';

// Require modules.
const { User } = require('../models');
const { hash, compare } = require('bcryptjs');
const { checkIfExists } = require('./utils');

// Define resolver functions.
// For user registration.
async function registerUser(userRegistrationData) {
    // Variables.
    let returned = null;        // To store results for checkIfExists function.

    // Check for existence.
    try {
        returned = await checkIfExists(userRegistrationData.emailAddress);
    } catch (error) {
        console.log(error);
    }

    // Extract boolean value from returned array.
    const isDuplicate = returned[0];

    // Register unique user.
    if (!isDuplicate) {
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
            return {_id: result._id, statusCode: "201 Created", responseMessage: "User Registered Successfully."};
        } catch (error) {
            console.log(error);
        }
    } else {
        // Return conflict on duplicate.
        return {_id: returned[1]._id, statusCode: "409 Conflict", responseMessage: "User Already Exists."};
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
        return { _id: result._id, statusCode:"200 OK", responseMessage:"User Updated Successfully." };
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
        return { _id: result._id, statusCode:"200 OK", responseMessage:"Password Updated Successfully." };
    } catch (error) {
        console.log(error);
    }
}

// For user deletion.
async function deleteUser(userLoginData) {
    // Variables.
    let returned = null;        // To store results for checkIfExists function.

    // Check for existence.
    try {
        returned = await checkIfExists(userLoginData.emailAddress);
    } catch (error) {
        console.log(error);
    }

    // Extract boolean value from returned array.
    const exists = returned[0];

    if (exists) {
        // Get user object from returned array.
        const existingUser = returned[1];

        // Compare passwords.
        const existingUserPassword = returned[1].password;
        let comparisonResult = null;

        try {
            comparisonResult = await compare(userLoginData.password, existingUserPassword);
        } catch (error) {
            console.log(error);
        }

        // Filter to query database.
        const filter = {
            emailAddress: userLoginData.emailAddress
        };

        // If passwords match, delete user.
        if (comparisonResult) {
            try {
                const result = await User.findOneAndDelete(filter);
                return {_id: result._id, statusCode: "200 OK", responseMessage: "User Deleted Successfully."};
            } catch (error) {
                console.log(error);
            }
        } else {
            return {statusCode: "401 Unauthorized", responseMessage: "Invalid Credentials."};
        }
    } else {
        return {statusCode: "404 Not Found", responseMessage: "User Not Found."};
    }
}

// Export.
exports.registerUserResolver = registerUser;
exports.updateUserDataResolver = updateUserData;
exports.updateUserPassword = updateUserPassword;
exports.deleteUser = deleteUser;