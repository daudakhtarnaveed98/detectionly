'use strict';

// Define mutations.
const mutations = `
    # Root level mutation.
    type Mutation {
        registerUser(userRegistrationData: UserRegistrationInput): User!
        updateUser(userUpdateData: UserUpdateInput): User!
    }
`;

// Export.
exports.mutations = mutations;