'use strict';

// Define mutations.
const mutations = `
    # Root level mutation.
    type Mutation {
        registerUser(userRegistrationData: UserRegistrationInput): User!
        updateUserData(UserDataUpdateInput: UserDataUpdateInput): User!
    }
`;

// Export.
exports.mutations = mutations;