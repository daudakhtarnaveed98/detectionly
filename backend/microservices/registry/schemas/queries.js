'use strict';

// Define queries.
const queries = `
    # Root level query.
    type Query {
        loginUser(userLoginData: UserLoginInput): AuthenticationData!
    }
`;

// Export.
exports.queries = queries;