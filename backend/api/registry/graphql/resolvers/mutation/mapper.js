"use strict";

// Require modules.
const update = require("./update");
const deletion  = require("./deletion");
const registration = require("./registration");
const jsonwebtoken = require("jsonwebtoken");
const commons = require("../../../../../commons");
require("dotenv-expand")(require("dotenv").config());

// Resolvers map.
const mutationResolversMap = {
    registerUser: async (args) => {
        const {userRegistrationData: userRegistrationData} = args;
        try {
            return await registration.registerUser(userRegistrationData);
        } catch (error) {
            console.error(error);
        }
    },

    updateUserInformation: async (args, req) => {
        // Get json web token from authorization header.
        const jwt = req.headers['authorization'].split(" ")[1];

        // Verify the provided token.
        try {
            jsonwebtoken.verify(jwt, process.env.PRIVATE_KEY);
            const {userEmailAddress: userEmailAddress, updatedInformation: updatedInformation} = args;
            try {
                return await update.updateUserInformation(userEmailAddress, updatedInformation);
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
            return {statusCode: commons.statusCodes.UNAUTHORIZED, statusMessage: "UNAUTHORIZED", responseMessage: "Invalid / Expired Token"};
        }
    },

    updateUserPassword: async (args, req) => {
        // Get json web token from authorization header.
        const jwt = req.headers['authorization'].split(" ")[1];

        // Verify the provided token.
        try {
            jsonwebtoken.verify(jwt, process.env.PRIVATE_KEY);
            const {userEmailAddress: userEmailAddress, userUpdatePasswordData: userUpdatePasswordData} = args;
            const {currentPassword: currentPassword, newPassword: newPassword} = userUpdatePasswordData;
            try {
                return await update.updateUserPassword(userEmailAddress, currentPassword, newPassword);
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
            return {statusCode: commons.statusCodes.UNAUTHORIZED, statusMessage: "UNAUTHORIZED", responseMessage: "Invalid / Expired Token"};
        }

    },

    deleteUserAccount: async (args, req) => {
        // Get json web token from authorization header.
        const jwt = req.headers['authorization'].split(" ")[1];

        // Verify the provided token.
        try {
            jsonwebtoken.verify(jwt, process.env.PRIVATE_KEY);
            const {userEmailAddress: userEmailAddress, password: password} = args;
            try {
                return await deletion.deleteUserAccount(userEmailAddress, password);
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
            return {statusCode: commons.statusCodes.UNAUTHORIZED, statusMessage: "UNAUTHORIZED", responseMessage: "Invalid / Expired Token"};
        }
    }
};

// Export.
exports.mutationResolversMap = mutationResolversMap;