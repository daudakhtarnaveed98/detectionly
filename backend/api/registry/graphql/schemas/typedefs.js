"use strict";

// Define root schema.
const rootSchemaDefinition = `
    type schema {
        query: Query
        mutation: Mutation
    }
`;

// Define user schema.
const userSchemaDefinition = `
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
    type AuthenticationData {
        token: String
        tokenExpirationTime: String
        response: Response!
    }
`;

const responseMessageDefinition = `
    type Response {
        statusCode: Int!
        statusMessage: String!
        responseMessage: String!
    }
`;

// Combined typedefs schema.
const TypeDefs =
  rootSchemaDefinition +
  userSchemaDefinition +
  authenticationDataDefinition +
  responseMessageDefinition;

// Export.
exports.TypeDefs = TypeDefs;
