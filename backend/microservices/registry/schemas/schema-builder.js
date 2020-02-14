'use strict';

// Require modules.
const { buildSchema } = require('graphql');
const {concatenateSchemas} = require('./utils');
const { userSchemaDefinition } = require('./user-schema');
const { rootSchemaDefinition } = require('./root-schema');
const { queries } = require('./queries');
const { mutations } = require('./mutations');

// Concatenate schemas, queries and mutations.
const concatenatedSchemas = concatenateSchemas(
    userSchemaDefinition, rootSchemaDefinition, queries, mutations
);

// Build graphql schema.
const graphqlSchema = buildSchema(concatenatedSchemas);

// Export schema.
exports.graphqlSchema = graphqlSchema;