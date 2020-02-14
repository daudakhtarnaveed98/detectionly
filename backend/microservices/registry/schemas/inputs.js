'use strict';

// Define inputs.
const UserInput = `
    # Input to register a user.
    input UserInput {
        userName: String!
        emailAddress: String!
        password: String!
        firstName: String!
        lastName: String!
    }
`;

// Export rootSchemaDefinition.
exports.UserInput = UserInput;