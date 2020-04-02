"use strict";

// Define inputs.
// For user registration.
const UserRegistrationInput = `
    input UserRegistrationInput {
        emailAddress: String!
        password: String!
    }`;

// For user login.
const UserLoginInput = `
    input UserLoginInput {
        emailAddress: String!
        password: String!
    }`;

// For user update.
const UserDataUpdateInput = `
    input UserInformationUpdateInput {
        firstName: String
        lastName: String
        gender: String
        phoneNumber: String
        dateOfBirth: String
        organizationName: String
        roleInOrganization: String
    }`;

// For password update.
const UserPasswordUpdateInput = `
    input UserPasswordUpdateInput {
        currentPassword: String!
        newPassword: String!
    }`;

// Combined input schema.
const InputSchema =
  UserRegistrationInput +
  UserLoginInput +
  UserDataUpdateInput +
  UserPasswordUpdateInput;

// Export.
exports.InputSchema = InputSchema;
