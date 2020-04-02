"use strict";

// Define mutation.
const mutationsSchema = `
    type Mutation {
        registerUser(userRegistrationData: UserRegistrationInput): Response!
        updateUserInformation(updatedInformation: UserInformationUpdateInput): Response!
        updateUserPassword(userUpdatePasswordData: UserPasswordUpdateInput): Response!
        deleteUserAccount(password: String!): Response!
    }
`;

// Export.
exports.mutationsSchema = mutationsSchema;
