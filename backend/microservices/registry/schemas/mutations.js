'use strict';

// Define mutations.
const mutations = `
    # Root level mutation.
    type Mutation {
        registerUser(userRegistrationData: UserRegistrationInput): Response!
        updateUserData(userUpdateData: UserDataUpdateInput): Response!
        updateUserPassword(userUpdatePasswordData: UserPasswordUpdateInput): Response!
        deleteUser(userLoginData: UserLoginInput): Response!
    }
`;

// Export.
exports.mutations = mutations;