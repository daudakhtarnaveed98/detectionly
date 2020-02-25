"use strict";

// Require modules.
const {buildSchema} = require("graphql");
const utils = require("../utils");
const queries = require("./queries");
const mutations = require("./mutations");
const inputs = require("./inputs");
const typedef = require("./typedefs");

// Concatenate schemas, queries and mutation.
const concatenatedSchema = utils.concatenateSchemas(
    queries.queriesSchema, mutations.mutationsSchema,
    inputs.InputSchema, typedef.TypeDefs
);

// Build graphql schema.
const graphqlSchema = buildSchema(concatenatedSchema);

// Export.
exports.graphqlSchema = graphqlSchema;