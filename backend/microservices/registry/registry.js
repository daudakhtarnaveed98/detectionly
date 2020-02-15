'use strict';

// Require modules.
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const schemas = require('./schemas');
const resolvers = require("./resolvers");
const database = require('./database');

// Initialize objects.
const registry = express();

// Initialize middleware.
registry.use(bodyParser.json());
registry.use('/api/registry', graphqlHttp({
    // Provide schema.
    schema: schemas.graphqlSchema,

    // Provide resolvers.
    rootValue: {
        registerUser: async (args) => {
            const {userRegistrationData: userRegistrationData} = args;
            try {
                return await resolvers.registerUserResolver(userRegistrationData);
            } catch (error) {
                console.log(error);
            }
        },

        updateUserData: async (args) => {
            const {userUpdateData: userUpdateData} = args;
            try {
                return await resolvers.updateUserDataResolver(userUpdateData);
            } catch (error) {
                console.log(error);
            }
        },

        updateUserPassword: async (args) => {
            const {userUpdatePasswordData: userUpdatePasswordData} = args;
            try {
                return await resolvers.updateUserPasswordResolver(userUpdatePasswordData);
            } catch (error) {
                console.log(error);
            }
        }
    },

    // Enable graphiql.
    graphiql: true,
}));

// Start listening.
registry.listen(3000);