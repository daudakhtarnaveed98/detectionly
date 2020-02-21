'use strict';

// Define mutation.
const mutationsSchema = `
    type Mutation {
        registerUser(userRegistrationData: UserRegistrationInput): Response!
        updateUserInformation(userEmailAddress: String!, updatedInformation: UserInformationUpdateInput): Response!
        updateUserPassword(userEmailAddress: String!, userUpdatePasswordData: UserPasswordUpdateInput): Response!
        deleteUserAccount(userEmailAddress: String!, password: String!): Response!
    }
`;

// Export.
exports.mutationsSchema = mutationsSchema;