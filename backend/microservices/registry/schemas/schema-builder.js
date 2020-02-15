'use strict';

// Require modules.
const { buildSchema } = require('graphql');
const {concatenateSchemas} = require('./utils');
const { queries } = require('./queries');
const { mutations } = require('./mutations');
const { UserRegistrationInput, UserLoginInput, UserUpdateInput } = require('./inputs');
const { userSchemaDefinition, rootSchemaDefinition, authenticationDataDefinition } = require('./typedefs');

// Concatenate schemas, queries and mutations.
const concatenatedSchema = concatenateSchemas(
    userSchemaDefinition, rootSchemaDefinition, queries, mutations, UserRegistrationInput,
    authenticationDataDefinition, UserLoginInput, UserUpdateInput
);

// Build graphql schema.
const graphqlSchema = buildSchema(concatenatedSchema);

// Export.
exports.graphqlSchema = graphqlSchema;