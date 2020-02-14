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
    input UserRegistrationInput {
        emailAddress: String!
        password: String!
    }
`;

// Export inputs.
exports.UserRegistrationInput = UserRegistrationInput;
exports.UserLoginInput = UserLoginInput;