"use strict";

// Define queries.
const queriesSchema = `
    type Query {
        loginUser(userLoginData: UserLoginInput): AuthenticationData!
        getUserInformation: UserInformation
    }
`;

// Export.
exports.queriesSchema = queriesSchema;
