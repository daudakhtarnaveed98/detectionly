'use strict';

// Require modules.
const { buildSchema } = require('graphql');
const {concatenateSchemas} = require('./utils');
const { queries } = require('./queries');
const { mutations } = require('./mutations');
const { UserRegistrationInput, UserLoginInput, UserDataUpdateInput, UserPasswordUpdateInput } = require('./inputs');
const { userSchemaDefinition, rootSchemaDefinition, authenticationDataDefinition, responseMessageDefinition } = require('./typedefs');

// Concatenate schemas, queries and mutations.
const concatenatedSchema = concatenateSchemas(
    userSchemaDefinition, rootSchemaDefinition, queries, mutations, UserRegistrationInput,
    authenticationDataDefinition, UserLoginInput, UserDataUpdateInput, UserPasswordUpdateInput,
    responseMessageDefinition
);

// Build graphql schema.
const graphqlSchema = buildSchema(concatenatedSchema);

// Export.
exports.graphqlSchema = graphqlSchema;