'use strict';

// Define root schema.
const rootSchemaDefinition = `
    type Query {
        users: [User!]!
    }
    
    type Mutation {
        createUser: String!
    }

    type schema {
        query: Query,
        mutation: Mutation
    }
`;

// Export rootSchemaDefinition.
exports.rootSchemaDefinition = rootSchemaDefinition;