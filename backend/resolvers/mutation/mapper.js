"use strict";

// Require modules.
const update = require("./update");
const deletion  = require("./deletion");
const registration = require("./registration");

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

    updateUserInformation: async (args) => {
        const {userEmailAddress: userEmailAddress, updatedInformation: updatedInformation} = args;
        try {
            return await update.updateUserInformation(userEmailAddress, updatedInformation);
        } catch (error) {
            console.error(error);
        }
    },

    updateUserPassword: async (args) => {
        const {userEmailAddress: userEmailAddress, userUpdatePasswordData: userUpdatePasswordData} = args;
        const {currentPassword: currentPassword, newPassword: newPassword} = userUpdatePasswordData;
        try {
            return await update.updateUserPassword(userEmailAddress, currentPassword, newPassword);
        } catch (error) {
            console.error(error);
        }
    },

    deleteUserAccount: async (args) => {
        const {userEmailAddress: userEmailAddress, password: password} = args;
        try {
            return (await deletion.deleteUserAccount(userEmailAddress, password));
        } catch (error) {
            console.error(error);
        }
    }
};

// Export.
exports.mutationResolversMap = mutationResolversMap;