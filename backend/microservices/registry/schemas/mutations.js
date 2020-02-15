'use strict';

// Define mutations.
const mutations = `
    # Root level mutation.
    type Mutation {
        registerUser(userRegistrationData: UserRegistrationInput): User!
        updateUserData(UserUpdateData: UserDataUpdateInput): User!
        updateUserPassword(UserUpdatePasswordData: UserPasswordUpdateInput): Response!
    }
`;

// Export.
exports.mutations = mutations;