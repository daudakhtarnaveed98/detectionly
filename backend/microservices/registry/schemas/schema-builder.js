'use strict';

// Require modules.
const { buildSchema } = require('graphql');
const {concatenateSchemas} = require('./utils');
const { userSchemaDefinition } = require('./user-schema');
const { rootSchemaDefinition } = require('./root-schema');

// Concatenate schemas.
const concatenatedSchemas = concatenateSchemas(userSchemaDefinition, rootSchemaDefinition);

// Build graphql schema.
const graphqlSchema = buildSchema(concatenatedSchemas);

// Export schema.
exports.graphqlSchema = graphqlSchema;