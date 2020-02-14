'use strict';

// Require modules.
const { buildSchema } = require('graphql');
const {concatenateSchemas} = require('./utils');
const { userSchemaDefinition } = require('./user-schema');
const { rootSchemaDefinition } = require('./root-schema');
const { queries } = require('./queries');
const { mutations } = require('./mutations');
const { UserRegistrationInput } = require('./inputs');

// Concatenate schemas, queries and mutations.
const concatenatedSchemas = concatenateSchemas(
    userSchemaDefinition, rootSchemaDefinition, queries, mutations, UserRegistrationInput
);

// Build graphql schema.
const graphqlSchema = buildSchema(concatenatedSchemas);

// Export schema.
exports.graphqlSchema = graphqlSchema;