'use strict';

// Define mutations.
const mutations = `
    # Root level mutation.
    type Mutation {
        registerUser(userRegistrationData: UserRegistrationInput): User!
        updateUserData(userUpdateData: UserDataUpdateInput): User!
        updateUserPassword(userUpdatePasswordData: UserPasswordUpdateInput): Response!
    }
`;

// Export.
exports.mutations = mutations;