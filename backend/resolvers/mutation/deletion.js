"use strict";

// Require modules.
const utils = require("../../utils");
const models = require("../../models");
const commons = require("../../commons");

// Function to delete user account.
async function deleteUserAccount(userEmailAddress, password) {
    // Try to check for existence in database using utility function.
    let userRecordExistsInDatabase = false;
    try {
        userRecordExistsInDatabase = await utils.checkIfUserRecordExistsInDatabase(userEmailAddress);
    } catch (error) {
        console.error(error);
    }

    // Proceed if user exists.
    if (userRecordExistsInDatabase) {
        // Compare entered password with correct password.
        let comparisonResult = false;
        try {
            comparisonResult = await utils.authenticateUser(userEmailAddress, password);
        } catch (error) {
            console.error(error);
        }

        // If comparisonResult is true, delete account, and return OK response.
        if (comparisonResult) {
            try {
                await models.User.findOneAndDelete({emailAddress: userEmailAddress});
                return {statusCode: commons.statusCodes.OK, statusMessage: "OK", responseMessage: "Account Deletion Successful"};
            } catch (error) {
                console.error(error);
            }
        }
        // Else return UNAUTHORIZED response.
        else {
            return {statusCode: commons.statusCodes.UNAUTHORIZED, statusMessage: "UNAUTHORIZED", responseMessage: "Invalid Password"};
        }
    }
    // Else return NOT FOUND response.
    else {
        return {statusCode: commons.statusCodes["NOT FOUND"], statusMessage: "NOT FOUND", responseMessage: "User Not Found"};
    }
}

// Export.
exports.deleteUserAccount = deleteUserAccount;