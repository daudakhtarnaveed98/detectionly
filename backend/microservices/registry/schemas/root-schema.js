'use strict';

// Define root schema.
const rootSchemaDefinition = `
    # Root level schema.
    type schema {
        query: Query
        mutation: Mutation
    }
`;

// Export root schema definition.
exports.rootSchemaDefinition = rootSchemaDefinition;