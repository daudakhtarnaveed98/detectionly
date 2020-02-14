'use strict';

// Define mutations.
const mutations = `
    # Root level mutation.
    type Mutation {
        registerUser(userInput: UserInput): User
    }
`;

// Export mutations.
exports.mutations = mutations;