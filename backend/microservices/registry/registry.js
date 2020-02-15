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
            return await resolvers.registerUserResolver(userRegistrationData);
        },
        updateUserData: async (args) => {
            const {UserDataUpdateInput: userUpdateData} = args;
            return await resolvers.updateUserDataResolver(userUpdateData);
        }
    },

    // Enable graphiql.
    graphiql: true,
}));

// Start listening.
registry.listen(3000);