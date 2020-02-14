'use strict';

// Define user schema.
const userSchemaDefinition = `
    type User {
        _id: ID!,
        userName: String!,
        emailAddress: String!,
        password: String!,
        firstName: String!,
        lastName: String!,
        gender: String,
        phoneNumber: String,
        dateOfBirth: String,
        organizationName: String,
        roleInOrganization: String
    }
`;

// Export userSchemaDefinition.
exports.userSchemaDefinition = userSchemaDefinition;