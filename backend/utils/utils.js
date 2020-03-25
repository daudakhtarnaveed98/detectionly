"use strict";

// Require modules.
const models = require("../models");
const commons = require("../commons");
const {compare} = require("bcryptjs");

// Utility functions.
// Function to check if user record exists in database.
async function checkIfUserRecordExistsInDatabase(userEmailAddress) {
    // Conditions to find user.
    const conditions = {
        emailAddress: userEmailAddress
    };

    // Check if user exists in database and return boolean.
    try {
        // Find user from database.
        let result = null;
        try {
            result = await models.User.findOne(conditions).exec();
        } catch (error) {
            console.error(error);
        }

        return result != null;
    }
    // Catch and log error.
    catch (error) {
        console.error(error);
    }
}

// Function to get a user from database.
async function getUserFromDatabase(userEmailAddress) {
    // Try to check if user record exists in database.
    let doesUserRecordExist = false;
    try {
        doesUserRecordExist = await checkIfUserRecordExistsInDatabase(userEmailAddress);
    } catch (error) {
        console.error(error);
    }

    // If doesUserRecordExist is true, get and return user.
    if (doesUserRecordExist) {
        // Conditions to find user.
        const conditions = {
            emailAddress: userEmailAddress
        };

        // Try to find user and return.
        try {
            // Find user from database.
            return await models.User.findOne(conditions).exec();
        }
            // Catch and log error.
        catch (error) {
            console.error(error);
        }
    } else {
        return null;
    }
}

// Function to check if required data for user registration is provided.
async function checkIfAllUserRegistrationDataIsProvided(userRegistrationData) {
    for (let key of Object.keys(userRegistrationData)) {
        // Return false if any key is null or empty string.
        if (userRegistrationData[key] == null || userRegistrationData[key] === "") {
            return false;
        }
    }
    // Return true in case of loop completion.
    return true;
}

// Function to save a user into database with provided user registration data.
async function saveUserToDatabase(userRegistrationData) {
    // Create user to save based on User model.
    const userToSave = new models.User({
        // Required properties.
        emailAddress: userRegistrationData.emailAddress,
        password: userRegistrationData.password,
        firstName: userRegistrationData.firstName,
        lastName: userRegistrationData.lastName,
    });
    // Try to save user to database.
    try {
        await userToSave.save();
        return commons.statusCodes["CREATED"];
    }
    // Catch and log error.
    catch (error) {
        console.error(error);
    }
}

// Function to fetch a user from database, extract and compare password and return true if passwords match.
async function authenticateUser(userEmailAddress, password) {
    // Try to fetch user object and then extract old password from it.
    let userFromDatabase = null;
    try {
        userFromDatabase = await getUserFromDatabase(userEmailAddress);
    } catch (error) {
        console.error(error);
    }

    if (userFromDatabase != null) {
        // Extract password.
        const {password: userCurrentPassword} = userFromDatabase;

        // Compare passwords.
        try {
            return await compare(password, userCurrentPassword);
        } catch (error) {
            console.error(error);
        }
    } else {
        return false;
    }
}

// Function to concatenate schemas.
function concatenateSchemas(...schemasToCombine) {
    // Variable to hold concatenated schemas.
    let concatenatedSchemas = "";

    // Loop and concatenate.
    for (const schema of schemasToCombine) {
        concatenatedSchemas = schema + concatenatedSchemas;
    }

    // Return concatenated schema.
    return concatenatedSchemas;
}

// Export.
exports.checkIfUserRecordExistsInDatabase = checkIfUserRecordExistsInDatabase;
exports.getUserFromDatabase = getUserFromDatabase;
exports.checkIfAllUserRegistrationDataIsProvided = checkIfAllUserRegistrationDataIsProvided;
exports.saveUserToDatabase = saveUserToDatabase;
exports.authenticateUser = authenticateUser;
exports.concatenateSchemas = concatenateSchemas;