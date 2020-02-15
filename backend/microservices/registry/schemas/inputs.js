'use strict';

// Define inputs.
// For user registration.
const UserRegistrationInput = `
    # Input to register a user.
    input UserRegistrationInput {
        emailAddress: String!
        password: String!
        firstName: String!
        lastName: String!
    }
`;

// For user login.
const UserLoginInput = `
    # Input to login a user.
    input UserLoginInput {
        emailAddress: String!
        password: String!
    }
`;

// For user update.
const UserDataUpdateInput = `
# Input to update a user.
    input UserDataUpdateInput {
        emailAddress: String!
        firstName: String
        lastName: String
        gender: String
        phoneNumber: String
        dateOfBirth: String
        organizationName: String
        roleInOrganization: String
    }
`;

// Export.
exports.UserRegistrationInput = UserRegistrationInput;
exports.UserLoginInput = UserLoginInput;
exports.UserDataUpdateInput = UserDataUpdateInput;