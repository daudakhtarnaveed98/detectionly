"use strict";

// Require modules.
const commons = require("../../commons");
const utils = require("../../utils");
const jsonwebtoken = require("jsonwebtoken");

// Function to login user.
async function loginUser(userLoginData) {
    // Extract email address and password.
    const {emailAddress: userEmailAddress, password: password} = userLoginData;

    // Try to check for existence in database using utility function.
    let userRecordExistsInDatabase = false;
    try {
        userRecordExistsInDatabase = await utils.checkIfUserRecordExistsInDatabase(userEmailAddress);
    } catch (error) {
        console.error(error);
    }

    // Proceed if user exists.
    if (userRecordExistsInDatabase) {
        // Try to compare entered password with correct password.
        let comparisonResult = false;
        try {
            comparisonResult = await utils.authenticateUser(userEmailAddress, password);
        } catch (error) {
            console.error(error);
        }

        // If comparisonResult is true, generate and return a token with OK response.
        if (comparisonResult) {
            try {
                const token = jsonwebtoken.sign({emailAddress: userEmailAddress,}, "vMpW~f#1KNAuiT!p%-QmO9K] f+bm9~VC?{s-4_#H<D)e0SC?-I-sGx_Lm<NFAt6", {expiresIn: "1h"});
                return ({"token":token, "tokenExpirationTime": 1, "response":{statusCode: commons.statusCodes.OK, statusMessage: "OK", responseMessage: "Login Successful"}});
            } catch (error) {
                console.error(error);
            }
        }
        // Else return UNAUTHORIZED response.
        else {
            return ({"response":{statusCode: commons.statusCodes.UNAUTHORIZED, statusMessage: "UNAUTHORIZED", responseMessage: "Invalid Password"}});
        }
    }
    // Else return NOT FOUND response.
    else {
        return ({"response":{statusCode: commons.statusCodes["NOT FOUND"], statusMessage: "NOT FOUND", responseMessage: "User Not Found"}});
    }
}

// Export.
exports.loginUser = loginUser;