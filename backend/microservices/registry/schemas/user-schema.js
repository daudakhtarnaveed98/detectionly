'use strict';

// Define user schema.
const userSchemaDefinition = `
    # User schema.
    type User {
        _id: ID!
        emailAddress: String!
        password: String!
        firstName: String!
        lastName: String!
        gender: String
        phoneNumber: String
        dateOfBirth: String
        organizationName: String
        roleInOrganization: String
    }
`;

// Export user schema definition.
exports.userSchemaDefinition = userSchemaDefinition;