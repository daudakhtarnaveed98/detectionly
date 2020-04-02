"use strict";

// Require modules.
const mutation = require("./mutation");
const query = require("./query");

// Merge mutation and query resolver maps.
const resolversMap = Object.assign(
  query.queryResolversMap,
  mutation.mutationResolversMap
);

// Export.
exports.resolversMap = resolversMap;
