'use strict';

// Define queries.
const queriesSchema = `
    type Query {
        loginUser(userLoginData: UserLoginInput): AuthenticationData!
    }
`;

// Export.
exports.queriesSchema = queriesSchema;