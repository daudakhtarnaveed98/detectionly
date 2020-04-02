"use strict";

// Require modules.
const fs = require("fs");
const path = require("path");
const utils = require("../../../../../utils");
const models = require("../../../../../models");
const commons = require("../../../../../commons");
require("dotenv-expand")(require("dotenv").config());

// Function to delete user account.
async function deleteUserAccount(userEmailAddress, password) {
  // Try to check for existence in database using utility function.
  let userRecordExistsInDatabase = false;
  try {
    userRecordExistsInDatabase = await utils.checkIfUserRecordExistsInDatabase(
      userEmailAddress
    );
  } catch (error) {
    console.error(error);
  }

  // Proceed if user exists.
  if (userRecordExistsInDatabase) {
    // Compare entered password with correct password.
    let comparisonResult = false;
    try {
      comparisonResult = await utils.authenticateUser(
        userEmailAddress,
        password
      );
    } catch (error) {
      console.error(error);
    }

    // If comparisonResult is true, delete account, user data directory and return OK response.
    if (comparisonResult) {
      // Delete user.
      try {
        await models.User.findOneAndDelete({ emailAddress: userEmailAddress });
      } catch (error) {
        console.error(error);
      }

      // Delete user data directory.
      const userDataDirectory = path.join(
        __dirname,
        "../../../../../",
        process.env.PERM_FILE_UPLOAD_PATH,
        userEmailAddress
      );
      fs.rmdir(userDataDirectory, { recursive: true }, (error) => {
        if (error) {
          console.error(error);
        }
      });

      // Return OK response.
      return {
        statusCode: commons.statusCodes.OK,
        statusMessage: "OK",
        responseMessage: "User Deletion Successful",
      };
    }
    // Else return UNAUTHORIZED response.
    else {
      return {
        statusCode: commons.statusCodes.UNAUTHORIZED,
        statusMessage: "UNAUTHORIZED",
        responseMessage: "Invalid Password",
      };
    }
  }
  // Else return NOT FOUND response.
  else {
    return {
      statusCode: commons.statusCodes["NOT FOUND"],
      statusMessage: "NOT FOUND",
      responseMessage: "User Not Found",
    };
  }
}

// Export.
exports.deleteUserAccount = deleteUserAccount;
