'use strict';

// Define root schema.
const rootSchemaDefinition = `
    # Root level schema.
    type schema {
        query: Query
        mutation: Mutation
    }
`;

// Define user schema.
const userSchemaDefinition = `
    # User schema.
    type User {
        _id: ID!
        emailAddress: String!
        password: String
        firstName: String!
        lastName: String!
        gender: String
        phoneNumber: String
        dateOfBirth: String
        organizationName: String
        roleInOrganization: String
    }
`;

// Other type definitions.
const authenticationDataDefinition = `
    # Authentication data.
    type AuthenticationData {
        _id: ID!
        token: String!
        tokenExpirationTime: Int!
    }
`;

// Export.
exports.rootSchemaDefinition = rootSchemaDefinition;
exports.userSchemaDefinition = userSchemaDefinition;
exports.authenticationDataDefinition = authenticationDataDefinition;