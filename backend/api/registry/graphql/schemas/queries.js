"use strict";

// Define queries.
const queriesSchema = `
    type Query {
        loginUser(userLoginData: UserLoginInput): AuthenticationData!
        getUserInformation(userEmailAddress: String): UserInformation
    }
`;

// Export.
exports.queriesSchema = queriesSchema;
