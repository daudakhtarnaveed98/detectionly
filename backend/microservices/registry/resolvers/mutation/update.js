'use strict';

// Require modules.
const utils = require('../../utils');
const models = require('../../models');
const commons = require('../../commons');
const {hash, compare} = require('bcryptjs');

// Function to update user personal information.
async function updateUserInformation(userEmailAddress, updatedInformation) {
    // Conditions to find user.
    const conditions = {
        emailAddress: userEmailAddress
    };

    // Update fields.
    const update = {
        firstName: updatedInformation.firstName,
        lastName: updatedInformation.lastName,
        gender: updatedInformation.gender,
        phoneNumber: updatedInformation.phoneNumber,
        dateOfBirth: updatedInformation.dateOfBirth,
        organizationName: updatedInformation.organizationName,
        roleInOrganization: updatedInformation.roleInOrganization
    };

    // Options.
    const options = {
        useFindAndModify:false,
        new: true
    };

    // Try to check for existence in database using utility function.
    let userRecordExistsInDatabase = false;
    try {
        userRecordExistsInDatabase = await utils.checkIfUserRecordExistsInDatabase(userEmailAddress);
    } catch (error) {
        console.log(error);
    }

    // Update if exists.
    if (userRecordExistsInDatabase) {
        // Find, update user and return OK response.
        try {
            await models.User.findOneAndUpdate(conditions, update, options).exec();
            return ({statusCode: commons.statusCodes.OK, statusMessage: "OK", responseMessage: "Update Successful"});
        } catch (error) {
            console.log(error);
        }
    }
    // Else return NOT FOUND response.
    else {
        return ({statusCode: commons.statusCodes["NOT FOUND"], statusMessage: "NOT FOUND", responseMessage: "User Not Found"});
    }
}

// Function to update user password.
async function updateUserPassword(userEmailAddress, currentPasswordEntered, newPassword) {
    // Try to check for existence in database using utility function.
    let userRecordExistsInDatabase = false;
    try {
        userRecordExistsInDatabase = await utils.checkIfUserRecordExistsInDatabase(userEmailAddress);
    } catch (error) {
        console.log(error);
    }

    // Proceed if user exists.
    if (userRecordExistsInDatabase) {
        // Compare entered password with correct password.
        const comparisonResult = await utils.authenticateUser(userEmailAddress, currentPasswordEntered);

        // If comparisonResult === true, update user password, and return OK response.
        if (comparisonResult) {
            try {
                // Hash new password before update.
                newPassword = await hash(newPassword, 12);
                await models.User.findOneAndUpdate({emailAddress: userEmailAddress}, {password: newPassword}, {useFindAndModify:false, new: true}).exec();
                return ({statusCode: commons.statusCodes.OK, statusMessage: "OK", responseMessage: "Password Update Successful"});
            } catch (error) {
                console.log(error);
            }
        }
        // Else return UNAUTHORIZED response.
        else {
            return ({statusCode: commons.statusCodes.UNAUTHORIZED, statusMessage: "UNAUTHORIZED", responseMessage: "Invalid Password"});
        }
    }
    // Else return NOT FOUND response.
    else {
        return ({statusCode: commons.statusCodes["NOT FOUND"], statusMessage: "NOT FOUND", responseMessage: "User Not Found"});
    }
}

// Export.
exports.updateUserInformation = updateUserInformation;
exports.updateUserPassword = updateUserPassword;