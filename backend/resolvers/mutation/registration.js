'use strict';

// Require modules.
const utils = require('../../utils');
const {hash} = require('bcryptjs');
const commons = require('../../commons');

// Function to register user.
async function registerUser(userRegistrationData) {
    // Try to check for existence in database using utility function.
    let userRecordExistsInDatabase = false;
    try {
        userRecordExistsInDatabase = await utils.checkIfUserRecordExistsInDatabase(userRegistrationData.emailAddress);
    } catch (error) {
        console.log(error);
    }

    // Register user if userRecordExistsInDatabase == false.
    if (!userRecordExistsInDatabase) {
        // Try to check if all registration data is provided.
        let isAllUserRegistrationDataProvided = false;
        try {
            isAllUserRegistrationDataProvided = await utils.checkIfAllUserRegistrationDataIsProvided(userRegistrationData);
        } catch (error) {
            console.log(error);
        }

        // If isAllUserRegistrationDataProvided == true, proceed with user registration.
        if (isAllUserRegistrationDataProvided) {
            // Try to hash password.
            try {
                userRegistrationData.password = await hash(userRegistrationData.password, 12);
            } catch (error) {
                console.log(error);
            }

            // Try to save user to database using utility function.
            try {
                const statusCode = await utils.saveUserToDatabase(userRegistrationData);

                // If successful, return response.
                if (statusCode === 201) {
                    return ({statusCode: statusCode, statusMessage: "CREATED", responseMessage: "Registration Successful"});
                }
                // If unsuccessful, return response.
                else {
                    return ({statusCode: statusCode, statusMessage: "BAD REQUEST", responseMessage: "Registration Failed"});
                }
            } catch (error) {
                console.log(error);
            }
        }
        // Else if isAllUserRegistrationDataProvided == false, return response.
        else {
            return ({statusCode: commons.statusCodes["NOT ACCEPTABLE"], statusMessage: "NOT ACCEPTABLE", responseMessage: "Insufficient Registration Data Provided"});
        }
    }
    // Return conflict response if userRecordExistsInDatabase == true.
    else {
        return ({statusCode: commons.statusCodes.CONFLICT, statusMessage: "CONFLICT", responseMessage: "User already exists"});
    }
}

// Export.
exports.registerUser = registerUser;