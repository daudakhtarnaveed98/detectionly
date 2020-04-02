"use strict";

// Require modules.
const utils = require("../../../../../utils");
const models = require("../../../../../models");
const commons = require("../../../../../commons");
const { hash } = require("bcryptjs");

// Function to update user personal information.
async function updateUserInformation(userEmailAddress, updatedInformation) {
  // Conditions to find user.
  const conditions = {
    emailAddress: userEmailAddress,
  };

  // Update fields.
  const update = {
    firstName: updatedInformation.firstName,
    lastName: updatedInformation.lastName,
    gender: updatedInformation.gender,
    phoneNumber: updatedInformation.phoneNumber,
    dateOfBirth: updatedInformation.dateOfBirth,
    organizationName: updatedInformation.organizationName,
    roleInOrganization: updatedInformation.roleInOrganization,
  };

  // Options.
  const options = {
    useFindAndModify: false,
    new: true,
  };

  // Try to check for existence in database using utility function.
  let userRecordExistsInDatabase = false;
  try {
    userRecordExistsInDatabase = await utils.checkIfUserRecordExistsInDatabase(
      userEmailAddress
    );
  } catch (error) {
    console.error(error);
  }

  // Update if record exists.
  if (userRecordExistsInDatabase) {
    // Find, update user and return OK response.
    try {
      await models.User.findOneAndUpdate(conditions, update, options).exec();
      return {
        statusCode: commons.statusCodes.OK,
        statusMessage: "OK",
        responseMessage: "Update Successful",
      };
    } catch (error) {
      console.error(error);
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

// Function to update user password.
async function updateUserPassword(
  userEmailAddress,
  currentPasswordEntered,
  newPassword
) {
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
    // Try to compare entered password with correct password.
    let comparisonResult = false;
    try {
      comparisonResult = await utils.authenticateUser(
        userEmailAddress,
        currentPasswordEntered
      );
    } catch (error) {
      console.error(error);
    }

    // If comparisonResult is true, hash user password, update and return OK response.
    if (comparisonResult) {
      // Check if new password is provided.
      if (newPassword != null || newPassword !== "") {
        // Try to hash new password.
        try {
          newPassword = await hash(newPassword, 12);
        } catch (error) {
          console.error(error);
        }

        // Try to update password.
        try {
          await models.User.findOneAndUpdate(
            { emailAddress: userEmailAddress },
            { password: newPassword },
            { useFindAndModify: false, new: true }
          ).exec();
          return {
            statusCode: commons.statusCodes.OK,
            statusMessage: "OK",
            responseMessage: "Password Update Successful",
          };
        } catch (error) {
          console.error(error);
        }
      }
      // Else return NOT ACCEPTABLE response.
      else {
        return {
          statusCode: commons.statusCodes["NOT ACCEPTABLE"],
          statusMessage: "NOT ACCEPTABLE",
          responseMessage: "New Password Not Provided",
        };
      }
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
exports.updateUserInformation = updateUserInformation;
exports.updateUserPassword = updateUserPassword;
