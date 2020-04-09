"use strict";

// Require modules.
const commons = require("../../../../../commons");
const utils = require("../../../../../utils");

// Function to get user information.
async function getUserInformation(userEmailAddress) {
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
    // Try to get user from database.
    let userFromDatabase = undefined;
    try {
      userFromDatabase = await utils.getUserFromDatabase(userEmailAddress);
      return {
        firstName: userFromDatabase.firstName,
        lastName: userFromDatabase.lastName,
        phoneNumber: userFromDatabase.phoneNumber,
        organizationName: userFromDatabase.organizationName,
        roleInOrganization: userFromDatabase.roleInOrganization,
        response: {
          statusCode: commons.statusCodes.OK,
          statusMessage: "OK",
          responseMessage: "User Information Retrieval Successful",
        },
      };
    } catch (error) {
      console.error(error);
    }
  }
  // Else return NOT FOUND response.
  else {
    return {
      firstName: null,
      lastName: null,
      phoneNumber: null,
      organizationName: null,
      roleInOrganization: null,
      response: {
        statusCode: commons.statusCodes["NOT FOUND"],
        statusMessage: "NOT FOUND",
        responseMessage: "User Not Found",
      },
    };
  }
}

// Export.
exports.getUserInformation = getUserInformation;
