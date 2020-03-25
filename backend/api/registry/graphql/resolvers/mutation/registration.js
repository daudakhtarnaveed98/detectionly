"use strict";

// Require modules.
const utils = require("../../../../../utils");
const {hash} = require("bcryptjs");
const commons = require("../../../../../commons");
const fs = require("fs");

// Function to register user.
async function registerUser(userRegistrationData) {
    // Try to check for existence in database using utility function.
    let userRecordExistsInDatabase = true;
    try {
        userRecordExistsInDatabase = await utils.checkIfUserRecordExistsInDatabase(userRegistrationData.emailAddress);
    } catch (error) {
        console.error(error);
    }

    // Register user if userRecordExistsInDatabase is false.
    if (!userRecordExistsInDatabase) {
        // Try to check if all registration data is provided.
        let isAllUserRegistrationDataProvided = false;
        try {
            isAllUserRegistrationDataProvided = await utils.checkIfAllUserRegistrationDataIsProvided(userRegistrationData);
        } catch (error) {
            console.error(error);
        }

        // If isAllUserRegistrationDataProvided is true, proceed with user registration.
        if (isAllUserRegistrationDataProvided) {
            // Try to hash password.
            try {
                userRegistrationData.password = await hash(userRegistrationData.password, 12);
            } catch (error) {
                console.error(error);
            }

            // Try to save user to database using utility function.
            try {
                const statusCode = await utils.saveUserToDatabase(userRegistrationData);

                // If successful, return CREATED response.
                if (statusCode === 201) {
                    return {statusCode: statusCode, statusMessage: "CREATED", responseMessage: "Registration Successful"};
                }
                // Else, return BAD REQUEST response.
                else {
                    return {statusCode: statusCode, statusMessage: "BAD REQUEST", responseMessage: "Registration Failed"};
                }
            } catch (error) {
                console.error(error);
            }
        }
        // Else if isAllUserRegistrationDataProvided is false, return NOT ACCEPTABLE response.
        else {
            return {statusCode: commons.statusCodes["NOT ACCEPTABLE"], statusMessage: "NOT ACCEPTABLE", responseMessage: "Insufficient Registration Data Provided"};
        }
    }
    // Return CONFLICT response if userRecordExistsInDatabase is true.
    else {
        return {statusCode: commons.statusCodes.CONFLICT, statusMessage: "CONFLICT", responseMessage: "User already exists"};
    }
}

// Export.
exports.registerUser = registerUser;