"use strict";

// Require modules.
const update = require("./update");
const deletion = require("./deletion");
const registration = require("./registration");
const commons = require("../../../../../commons");
require("dotenv-expand")(require("dotenv").config());

// Resolvers map.
const mutationResolversMap = {
  registerUser: async (args) => {
    const { userRegistrationData: userRegistrationData } = args;
    try {
      return await registration.registerUser(userRegistrationData);
    } catch (error) {
      console.error(error);
    }
  },
  updateUserInformation: async (args, req) => {
    // Get isAuthorized from req.
    const isAuthorized = req.isAuthorized;

    // If isAuthorized === false, clean temporary upload directory, and return UNAUTHORIZED response.
    if (isAuthorized === false) {
      return {
        statusCode: commons.statusCodes.UNAUTHORIZED,
        statusMessage: "UNAUTHORIZED",
        responseMessage: "Invalid / Expired Token",
      };
    } else {
      const { updatedInformation: updatedInformation } = args;
      try {
        return await update.updateUserInformation(
          req.emailAddress,
          updatedInformation
        );
      } catch (error) {
        console.error(error);
      }
    }
  },
  updateUserPassword: async (args, req) => {
    // Get isAuthorized from req.
    const isAuthorized = req.isAuthorized;

    // If isAuthorized === false, clean temporary upload directory, and return UNAUTHORIZED response.
    if (isAuthorized === false) {
      return {
        statusCode: commons.statusCodes.UNAUTHORIZED,
        statusMessage: "UNAUTHORIZED",
        responseMessage: "Invalid / Expired Token",
      };
    } else {
      const { userUpdatePasswordData: userUpdatePasswordData } = args;
      const {
        currentPassword: currentPassword,
        newPassword: newPassword,
      } = userUpdatePasswordData;
      try {
        return await update.updateUserPassword(
          req.emailAddress,
          currentPassword,
          newPassword
        );
      } catch (error) {
        console.error(error);
      }
    }
  },
  deleteUserAccount: async (args, req) => {
    // Get isAuthorized from req.
    const isAuthorized = req.isAuthorized;

    // If isAuthorized === false, clean temporary upload directory, and return UNAUTHORIZED response.
    if (isAuthorized === false) {
      return {
        statusCode: commons.statusCodes.UNAUTHORIZED,
        statusMessage: "UNAUTHORIZED",
        responseMessage: "Invalid / Expired Token",
      };
    } else {
      const { password: password } = args;
      try {
        return await deletion.deleteUserAccount(req.emailAddress, password);
      } catch (error) {
        console.error(error);
      }
    }
  },
};

// Export.
exports.mutationResolversMap = mutationResolversMap;
