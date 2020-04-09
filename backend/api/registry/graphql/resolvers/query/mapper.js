"use strict";

// Require modules.
const login = require("./login");
const information = require("./information");
const commons = require("../../../../../commons");

// Resolvers map.
const queryResolversMap = {
  loginUser: async (args) => {
    const { userLoginData: userLoginData } = args;
    try {
      return await login.loginUser(userLoginData);
    } catch (error) {
      console.error(error);
    }
  },
  getUserInformation: async (args, req) => {
    // Get isAuthorized from req.
    const isAuthorized = req.isAuthorized;

    // If isAuthorized === false, clean temporary upload directory, and return UNAUTHORIZED response.
    if (isAuthorized === false) {
      return {
        firstName: null,
        lastName: null,
        phoneNumber: null,
        organizationName: null,
        roleInOrganization: null,
        response: {
          statusCode: commons.statusCodes.UNAUTHORIZED,
          statusMessage: "UNAUTHORIZED",
          responseMessage: "Invalid / Expired Token"
          }
      };
    } else {
      const {userEmailAddress: userEmailAddress} = args;
      try {
        return await information.getUserInformation(userEmailAddress);
      } catch (error) {
        console.error(error);
      }
    }
  }
};

// Export.
exports.queryResolversMap = queryResolversMap;
