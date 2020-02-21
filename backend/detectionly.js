'use strict';

// Require modules.
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const schemas = require('./schemas');
const resolvers = require("./resolvers");
require('./configurations/database');

// Initialize objects.
const detectionly = express();

// Initialize middleware.
detectionly.use(bodyParser.json());
detectionly.use('/api', graphqlHttp({
    // Provide schema.
    schema: schemas.graphqlSchema,

    // Provide resolvers.
    rootValue: {
        registerUser: async (args) => {
            const {userRegistrationData: userRegistrationData} = args;
            try {
                return (await resolvers.registerUserResolver(userRegistrationData));
            } catch (error) {
                console.log(error);
            }
        },

        updateUserInformation: async (args) => {
            const {userEmailAddress: userEmailAddress, updatedInformation: updatedInformation} = args;
            try {
                return (await resolvers.updateUserInformationResolver(userEmailAddress, updatedInformation));
            } catch (error) {
                console.log(error);
            }
        },

        updateUserPassword: async (args) => {
            const {userEmailAddress: userEmailAddress, userUpdatePasswordData: userUpdatePasswordData} = args;
            const {currentPassword: currentPassword, newPassword: newPassword} = userUpdatePasswordData;
            try {
                return (await resolvers.updateUserPasswordResolver(userEmailAddress, currentPassword, newPassword));
            } catch (error) {
                console.log(error);
            }
        },

        deleteUserAccount: async (args) => {
            const {userEmailAddress: userEmailAddress, password: password} = args;
            try {
                return (await resolvers.deleteUserAccountResolver(userEmailAddress, password));
            } catch (error) {
                console.log(error);
            }
        },

        loginUser: async (args) => {
            const {userLoginData: userLoginData} = args;
            try {
                return (await resolvers.loginUserResolver(userLoginData));
            } catch (error) {
                console.log(error);
            }
        }
    },

    // Enable graphiql.
    graphiql: true,
}));

// Start listening.
detectionly.listen(3000);